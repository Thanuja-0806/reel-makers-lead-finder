import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateSearchQueries } from './queryGenerator.js';
import { executeWebSearch } from './webSearch.js';
import { crawlAndExtractLeads } from './crawler.js';
import { deduplicateLeads } from './deduplicator.js';
import { generateExcelBuffer } from './excelExporter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    
    // Allow localhost, exact matches, or any vercel.app deployment preview subdomain
    if (
      cleanOrigin.includes('localhost') ||
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS block by Reel Makers Backend'), false);
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Active SSE client streams by search ID
const sseClients = new Map();

/**
 * SSE Stream Endpoint for Live Progress Updates
 */
app.get('/api/search/stream', (req, res) => {
  const { searchId } = req.query;
  if (!searchId) {
    return res.status(400).send('Missing searchId query parameter');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.set(searchId, res);

  req.on('close', () => {
    sseClients.delete(searchId);
  });
});

function sendSseEvent(searchId, payload) {
  const clientRes = sseClients.get(searchId);
  if (clientRes) {
    clientRes.write(`data: ${JSON.stringify(payload)}\n\n`);
  }
}

app.post('/api/search', async (req, res) => {
  const { city, searchId, apiKeys = {} } = req.body;

  if (!city || !city.trim()) {
    return res.status(400).json({ error: 'City name is required' });
  }

  const cleanCity = city.trim();
  const currentSearchId = searchId || `search_${Date.now()}`;

  // Merge client-sent keys with backend .env file variables
  const mergedApiKeys = {
    serpapi: apiKeys.serpapi || process.env.SERPAPI_KEY || '',
    googleApiKey: apiKeys.googleApiKey || process.env.GOOGLE_API_KEY || '',
    googleCx: apiKeys.googleCx || process.env.GOOGLE_CX || '',
  };

  try {
    // 1. Generate Intelligent Queries
    sendSseEvent(currentSearchId, {
      type: 'STAGE_CHANGE',
      stage: 'QUERIES',
      message: `Generating intelligent search queries for ${cleanCity}...`
    });

    const queries = generateSearchQueries(cleanCity);

    sendSseEvent(currentSearchId, {
      type: 'QUERIES_GENERATED',
      queries,
      message: `Generated ${queries.length} targeted search queries.`
    });

    // 2. Perform Web Discovery
    sendSseEvent(currentSearchId, {
      type: 'STAGE_CHANGE',
      stage: 'SEARCHING',
      message: `Executing multi-engine web search...`
    });

    const searchHits = await executeWebSearch(
      queries,
      cleanCity,
      (progressData) => sendSseEvent(currentSearchId, progressData),
      mergedApiKeys
    );

    // 3. Crawl & Extract Info
    sendSseEvent(currentSearchId, {
      type: 'STAGE_CHANGE',
      stage: 'CRAWLING',
      message: `Crawling discovered websites for contacts, Instagram, email & phone...`
    });

    const rawLeads = await crawlAndExtractLeads(
      searchHits,
      cleanCity,
      (progressData) => sendSseEvent(currentSearchId, progressData)
    );

    // 4. Deduplicate Findings
    sendSseEvent(currentSearchId, {
      type: 'STAGE_CHANGE',
      stage: 'DEDUPLICATING',
      message: `Removing duplicates using Email, Phone, Domain, and Social handle matching...`
    });

    const finalLeads = deduplicateLeads(rawLeads);

    sendSseEvent(currentSearchId, {
      type: 'COMPLETE',
      message: `Completed discovery! Found ${finalLeads.length} unique reel maker leads in ${cleanCity}.`,
      totalLeads: finalLeads.length
    });

    return res.json({
      success: true,
      city: cleanCity,
      totalCount: finalLeads.length,
      queriesExecuted: queries.length,
      leads: finalLeads
    });

  } catch (error) {
    console.error('Error during lead discovery:', error);
    sendSseEvent(currentSearchId, {
      type: 'ERROR',
      message: `Lead discovery error: ${error.message}`
    });
    return res.status(500).json({ error: 'Failed to process lead discovery' });
  }
});

/**
 * Excel File Export Endpoint
 */
app.post('/api/export', (req, res) => {
  const { leads, city } = req.body;
  if (!leads || !Array.isArray(leads)) {
    return res.status(400).json({ error: 'Invalid leads payload' });
  }

  const cleanCity = (city || 'City').trim().replace(/\s+/g, '_');
  const buffer = generateExcelBuffer(leads, city);

  const filename = `Reel_Makers_${cleanCity}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.send(buffer);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`🚀 Reel Makers Lead Finder Server running on http://localhost:${portToTry}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${portToTry} is already in use. Trying port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);

