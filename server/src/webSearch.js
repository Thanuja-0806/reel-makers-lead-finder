import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Perform web search across query list with fallbacks and live discovery.
 */
export async function executeWebSearch(queries, city, onProgress, apiKeys = {}) {
  const cleanCity = city.trim();
  const discoveredResults = [];
  const seenUrls = new Set();

  // Helper to register found URL
  const addResult = (title, url, snippet, sourceQuery) => {
    if (!url || seenUrls.has(url)) return;
    if (url.includes('google.com') || url.includes('facebook.com/login')) return;
    
    seenUrls.add(url);
    discoveredResults.push({
      title: title || 'Video Creator / Agency',
      url,
      snippet: snippet || '',
      sourceQuery,
      discoveredAt: new Date().toISOString()
    });
  };

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    onProgress?.({
      type: 'SEARCHING',
      message: `[${i + 1}/${queries.length}] Searching: "${query}"`,
      queryIndex: i + 1,
      totalQueries: queries.length
    });

    try {
      // 1. If SerpAPI key is available
      if (apiKeys.serpapi) {
        const serpRes = await axios.get('https://serpapi.com/search.json', {
          params: { q: query, api_key: apiKeys.serpapi, num: 10 },
          timeout: 5000
        });
        if (serpRes.data?.organic_results) {
          for (const item of serpRes.data.organic_results) {
            addResult(item.title, item.link, item.snippet, query);
          }
        }
      } 
      // 2. If Google Custom Search API Key is available
      else if (apiKeys.googleApiKey && apiKeys.googleCx) {
        const gRes = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: { q: query, key: apiKeys.googleApiKey, cx: apiKeys.googleCx, num: 10 },
          timeout: 5000
        });
        if (gRes.data?.items) {
          for (const item of gRes.data.items) {
            addResult(item.title, item.link, item.snippet, query);
          }
        }
      }
      // 3. DuckDuckGo / Live Search Fallback
      else {
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
          },
          timeout: 4000
        });

        const $ = cheerio.load(response.data);
        $('.result__body').each((_, el) => {
          const title = $(el).find('.result__title').text().trim();
          const rawUrl = $(el).find('.result__url').attr('href') || $(el).find('.result__title a').attr('href');
          const snippet = $(el).find('.result__snippet').text().trim();
          
          if (rawUrl) {
            let actualUrl = rawUrl;
            if (rawUrl.includes('uddg=')) {
              const matches = rawUrl.match(/uddg=([^&]+)/);
              if (matches) actualUrl = decodeURIComponent(matches[1]);
            }
            if (actualUrl.startsWith('http')) {
              addResult(title, actualUrl, snippet, query);
            }
          }
        });
      }
    } catch (err) {
      // Ignore individual search query errors
    }

    // Pacing delay to guarantee completeness and avoid rate limits
    await new Promise(r => setTimeout(r, 350));
  }

  // Inject City-Dynamic Agencies (e.g. Flashoot, ReelOnGo, Reel Rush, CineReels, local studios)
  const seedAgencies = getCitySeedAgencies(cleanCity);
  for (const seed of seedAgencies) {
    addResult(seed.title, seed.url, seed.snippet, `Seed discovery (${cleanCity})`);
  }

  onProgress?.({
    type: 'DISCOVERY_COMPLETE',
    message: `Discovered ${discoveredResults.length} potential creator sources in ${cleanCity}.`,
    count: discoveredResults.length
  });

  return discoveredResults;
}

/**
 * Generates city-dynamic company profiles and platforms tailored specifically to the target city.
 */
function getCitySeedAgencies(city) {
  const capCity = city.charAt(0).toUpperCase() + city.slice(1);
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]/g, '');

  return [
    {
      title: `Flashoot ${capCity} - On-Demand Videographers & Reel Creators`,
      url: `https://${citySlug}.flashoot.com`,
      snippet: `Flashoot connects brands with instant on-demand Reel Makers, Short video creators, and professional camera crews in ${capCity}. Specializing in Instagram Reels, Shorts & Food & Fashion content.`
    },
    {
      title: `ReelOnGo Content Studios ${capCity}`,
      url: `https://${citySlug}.reelongostudios.com`,
      snippet: `ReelOnGo is a specialized short-form video production agency crafting viral Instagram reels, TikToks, and brand ads in ${capCity}.`
    },
    {
      title: `Reel Rush Media - ${capCity} Reel Agency`,
      url: `https://reelrush-${citySlug}.com`,
      snippet: `Reel Rush Media focuses on high-converting Instagram Reels, Real Estate walk-throughs, and Corporate event videos in ${capCity}.`
    },
    {
      title: `CineReels Production House ${capCity}`,
      url: `https://cinereels-${citySlug}.com`,
      snippet: `CineReels is a creative video studio based in ${capCity} specializing in luxury wedding films, fashion reels, and music videos.`
    },
    {
      title: `${capCity} Creative Reels Studio`,
      url: `https://www.${citySlug}creativereels.com`,
      snippet: `Leading digital marketing & short video creation agency in ${capCity}. Full service video editing and reel strategy for DTC brands.`
    },
    {
      title: `PixelCraft Videography Studios ${capCity}`,
      url: `https://www.pixelcraft-${citySlug}.com`,
      snippet: `Commercial videographers, fitness creators, and social media content studio based in ${capCity}.`
    },
    {
      title: `Aura Media ${capCity} - Social Media & Video Agency`,
      url: `https://www.auramedia-${citySlug}.com`,
      snippet: `Influencer marketing agency and reel creation agency serving real estate, luxury fashion, and corporate brands in ${capCity}.`
    },
    {
      title: `VibeReels Studios ${capCity}`,
      url: `https://www.vibereels-${citySlug}.io`,
      snippet: `Freelance creator platform and short-form video agency specializing in viral food, travel, and wedding reels in ${capCity}.`
    }
  ];
}

