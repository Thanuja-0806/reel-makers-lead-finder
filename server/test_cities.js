import { generateSearchQueries } from './src/queryGenerator.js';
import { executeWebSearch } from './src/webSearch.js';
import { crawlAndExtractLeads } from './src/crawler.js';
import { deduplicateLeads } from './src/deduplicator.js';

async function testPerformance() {
  const city = 'London';
  const start = Date.now();
  
  console.log(`⏱️ Starting speed test for city: ${city}`);
  
  // 1. Generate Queries
  const queries = generateSearchQueries(city);
  console.log(`🔍 Generated ${queries.length} queries.`);

  // 2. Perform Discovery
  console.log(`🔍 Executing parallel web discovery...`);
  const searchHits = await executeWebSearch(queries, city, (prog) => {
    console.log(`   [Search] ${prog.message}`);
  }, { serpapi: '' });

  console.log(`✅ Discovered ${searchHits.length} potential sources. Time elapsed: ${((Date.now() - start)/1000).toFixed(2)}s`);

  // 3. Parallel Crawl
  console.log(`🕷️ Crawling websites in parallel (concurrency limit = 6)...`);
  const rawLeads = await crawlAndExtractLeads(searchHits, city, (prog) => {
    console.log(`   [Crawl] ${prog.message}`);
  });

  console.log(`✅ Crawling complete. Leads count: ${rawLeads.length}. Time elapsed: ${((Date.now() - start)/1000).toFixed(2)}s`);

  // 4. Deduplicate
  const finalLeads = deduplicateLeads(rawLeads);
  console.log(`🎉 Final unique leads: ${finalLeads.length}`);
  console.log(`⚡ TOTAL PIPELINE EXECUTION TIME: ${((Date.now() - start)/1000).toFixed(2)}s`);
}

testPerformance();
