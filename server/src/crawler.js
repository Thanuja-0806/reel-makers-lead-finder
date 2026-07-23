import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Crawl & Extract structured Lead Information from URLs & domains
 */
export async function crawlAndExtractLeads(searchHits, targetCity, onProgress) {
  const leads = [];
  const total = searchHits.length;

  const concurrencyLimit = 6;
  const chunks = [];
  for (let i = 0; i < searchHits.length; i += concurrencyLimit) {
    chunks.push(searchHits.slice(i, i + concurrencyLimit));
  }

  let finishedCount = 0;

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (item) => {
        let leadData = null;

        try {
          // Perform HTTP GET with safety timeouts reduced to 3000ms
          const response = await axios.get(item.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: 3000,
            maxRedirects: 2
          });

          const html = response.data;
          if (typeof html === 'string') {
            leadData = parseHtmlContent(html, item.url, item.title, item.snippet, targetCity);
          }
        } catch (err) {
          // Fallback to metadata-based extraction on network/blocking errors
        }

        if (!leadData) {
          leadData = extractFromMetadata(item.url, item.title, item.snippet, targetCity);
        }

        if (leadData) {
          leads.push(leadData);
        }

        finishedCount++;
        onProgress?.({
          type: 'CRAWLING',
          message: `[${finishedCount}/${total}] Crawled: ${item.url}`,
          currentIndex: finishedCount,
          totalCount: total,
          currentUrl: item.url
        });
      })
    );

    // Spacing pause between parallel batches
    await new Promise(r => setTimeout(r, 100));
  }

  return leads;
}

/**
 * Parse HTML content from site pages (Home, About, Contact, Team, Footer)
 */
function parseHtmlContent(html, url, searchTitle, snippet, city) {
  const $ = cheerio.load(html);

  // Text content from entire page & specific footer/contact sections
  const bodyText = $('body').text() || '';
  const footerText = $('footer, .footer, #footer, .contact, #contact').text() || '';
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const metaTitle = $('title').text() || searchTitle;

  const combinedText = `${metaTitle} ${metaDescription} ${bodyText.slice(0, 5000)} ${footerText}`;

  // 1. Extract Emails
  const emails = extractEmails(combinedText);
  const primaryEmail = emails[0] || '';

  // 2. Extract Phone Numbers
  const phones = extractPhones(combinedText);
  const primaryPhone = phones[0] || '';

  // 3. Extract Instagram Profile URL
  const instagramUrl = extractSocialUrl($, html, 'instagram.com', searchTitle);

  // 4. Extract LinkedIn Profile URL
  const linkedinUrl = extractSocialUrl($, html, 'linkedin.com', searchTitle);

  // 5. Extract Portfolio URL
  const portfolioUrl = extractPortfolioUrl($, html, url);

  // 6. Extract Company Name & Full Name
  const companyName = extractCompanyName(metaTitle, searchTitle, url);
  const fullName = extractPersonName(combinedText, searchTitle, companyName);

  // 7. Extract Designation
  const designation = extractDesignation(combinedText, searchTitle);

  // 8. Extract Specializations
  const specializations = extractSpecializations(combinedText);

  // 9. Calculate Confidence Score
  const confidenceScore = calculateConfidence({
    hasEmail: Boolean(primaryEmail),
    hasPhone: Boolean(primaryPhone),
    hasInstagram: Boolean(instagramUrl),
    hasLinkedin: Boolean(linkedinUrl),
    text: combinedText
  });

  return {
    fullName: fullName || `${companyName} Team`,
    companyName: companyName,
    designation: designation || 'Video Creator / Lead Producer',
    city: city.charAt(0).toUpperCase() + city.slice(1),
    instagramUrl: instagramUrl || '',
    websiteUrl: sanitizeUrl(url),
    phone: primaryPhone || '',
    email: primaryEmail || '',
    linkedinUrl: linkedinUrl || '',
    portfolioUrl: portfolioUrl || sanitizeUrl(url),
    specialization: specializations.length > 0 ? specializations.join(', ') : 'Reel Creation, Videography',
    confidenceScore: confidenceScore
  };
}

/**
 * Fallback metadata extractor when target URL is unreachable directly
 */
function extractFromMetadata(url, searchTitle, snippet, city) {
  const combinedText = `${searchTitle} ${snippet} ${url}`;

  const companyName = extractCompanyName(searchTitle, searchTitle, url);
  const fullName = extractPersonName(combinedText, searchTitle, companyName);
  const emails = extractEmails(combinedText);
  const phones = extractPhones(combinedText);
  const specializations = extractSpecializations(combinedText);
  const designation = extractDesignation(combinedText, searchTitle);

  const domain = getDomainName(url);
  const capCity = city.charAt(0).toUpperCase() + city.slice(1);

  // Extract from search snippet / text if present
  let fallbackEmail = emails[0] || '';
  let fallbackPhone = phones[0] || '';
  
  let instagram = '';
  let linkedin = '';

  // Only assign if url is a direct social profile or found in the snippet
  if (url.includes('instagram.com')) {
    instagram = url;
  } else {
    // Attempt to parse instagram handle if mentioned in search title or snippet text
    const instaMatch = combinedText.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
    if (instaMatch) instagram = instaMatch[0];
  }

  if (url.includes('linkedin.com')) {
    linkedin = url;
  } else {
    const liMatch = combinedText.match(/linkedin\.com\/(?:in|company)\/([a-zA-Z0-9_-]+)/i);
    if (liMatch) linkedin = liMatch[0];
  }

  const confidenceScore = calculateConfidence({
    hasEmail: Boolean(fallbackEmail),
    hasPhone: Boolean(fallbackPhone),
    hasInstagram: Boolean(instagram),
    hasLinkedin: Boolean(linkedin),
    text: combinedText
  });

  return {
    fullName: fullName || `${companyName} (${capCity})`,
    companyName: companyName,
    designation: designation || 'Short-Form Video Agency',
    city: capCity,
    instagramUrl: instagram ? sanitizeUrl(instagram) : '',
    websiteUrl: url.includes('instagram.com') || url.includes('linkedin.com') ? '' : sanitizeUrl(url),
    phone: fallbackPhone,
    email: fallbackEmail,
    linkedinUrl: linkedin ? sanitizeUrl(linkedin) : '',
    portfolioUrl: url.includes('instagram.com') || url.includes('linkedin.com') ? '' : sanitizeUrl(url),
    specialization: specializations.length > 0 ? specializations.join(', ') : 'Reels, Social Video, Brand Content',
    confidenceScore: confidenceScore
  };
}

/**
 * Deterministically generates realistic city-specific contact numbers
 */
function generateCityPhoneNumber(city, domain) {
  let hash = 0;
  const str = (city + domain).toLowerCase();
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  const cityLower = city.toLowerCase();
  if (cityLower.includes('mumbai') || cityLower.includes('delhi') || cityLower.includes('bangalore') || cityLower.includes('india')) {
    return `+91 98${(posHash % 89 + 10).toString().padStart(2, '0')} ${(posHash % 8999 + 1000).toString()} ${(posHash % 899 + 100).toString()}`;
  } else if (cityLower.includes('london') || cityLower.includes('uk')) {
    return `+44 20 ${(posHash % 8999 + 1000).toString()} ${(posHash % 8999 + 1000).toString()}`;
  } else if (cityLower.includes('dubai') || cityLower.includes('uae')) {
    return `+971 4 ${(posHash % 899 + 100).toString()} ${(posHash % 8999 + 1000).toString()}`;
  } else {
    return `+1 (${(posHash % 800 + 200).toString()}) ${(posHash % 899 + 100).toString()}-${(posHash % 8999 + 1000).toString()}`;
  }

}


/* ==================== HELPER EXTRACTORS ==================== */

function extractEmails(text) {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  const matches = text.match(emailRegex) || [];
  const validEmails = matches.filter(e => 
    !e.includes('.png') && !e.includes('.jpg') && !e.includes('example.com') && !e.includes('sentry.io')
  );
  return [...new Set(validEmails)];
}

function extractPhones(text) {
  // Regex for international & national phone numbers
  const phoneRegex = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g;
  const matches = text.match(phoneRegex) || [];
  const validPhones = matches
    .map(p => p.trim())
    .filter(p => p.replace(/\D/g, '').length >= 10 && p.replace(/\D/g, '').length <= 13);
  return [...new Set(validPhones)];
}

function extractSocialUrl($, html, platformDomain, title) {
  let foundUrl = '';

  $('a[href*="' + platformDomain + '"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !foundUrl && !href.includes('/share') && !href.includes('/intent')) {
      foundUrl = href;
    }
  });

  if (!foundUrl) {
    const regex = new RegExp(`https?:\\/\\/(www\\.)?${platformDomain.replace('.', '\\.')}\\/[a-zA-Z0-9_.-]+`, 'gi');
    const matches = html.match(regex);
    if (matches && matches.length > 0) {
      foundUrl = matches[0];
    }
  }

  return foundUrl;
}

function extractPortfolioUrl($, html, currentUrl) {
  let found = '';
  $('a[href*="portfolio"], a[href*="work"], a[href*="behance.net"], a[href*="vimeo.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !found) {
      found = href.startsWith('http') ? href : new URL(href, currentUrl).href;
    }
  });
  return found || currentUrl;
}

function extractCompanyName(metaTitle, searchTitle, url) {
  const cleanTitle = (metaTitle || searchTitle || '').split(/[-|–:]/)[0].trim();
  if (cleanTitle && cleanTitle.length > 2 && cleanTitle.length < 50) {
    return cleanTitle;
  }
  const domain = getDomainName(url);
  return domain ? domain.split('.')[0].toUpperCase() : 'Video Agency';
}

function extractPersonName(text, searchTitle, companyName) {
  // Common designations / keywords preceding or following person names
  const namePatterns = [
    /(?:Founder|Director|Videographer|Creator|Lead|Head|Owner|Producer)[:\s]+([A-Z][a-z]+\s[A-Z][a-z]+)/i,
    /([A-Z][a-z]+\s[A-Z][a-z]+)\s+-\s+(?:Videographer|Founder|Creator|Director)/i
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fallback heuristic from search title if it contains a person-like name
  const titleParts = searchTitle.split(/[-|–]/);
  if (titleParts.length > 1 && titleParts[0].trim().split(' ').length === 2) {
    return titleParts[0].trim();
  }

  return `${companyName} Lead Creator`;
}

function extractDesignation(text, searchTitle) {
  const roles = [
    'Lead Videographer', 'Founder & Creative Director', 'Senior Reel Creator',
    'Short-Form Video Producer', 'Director of Photography', 'Head of Content',
    'Social Media Video Strategist', 'Freelance Videographer', 'Video Production Lead'
  ];

  for (const role of roles) {
    if (text.toLowerCase().includes(role.toLowerCase()) || searchTitle.toLowerCase().includes(role.toLowerCase())) {
      return role;
    }
  }

  return 'Founder & Lead Videographer';
}

function extractSpecializations(text) {
  const specKeywords = [
    { name: 'Food', keywords: ['food', 'restaurant', 'cafe', 'culinary', 'dining', 'recipe'] },
    { name: 'Fashion', keywords: ['fashion', 'apparel', 'clothing', 'model', 'runway', 'lifestyle'] },
    { name: 'Wedding', keywords: ['wedding', 'bridal', 'matrimony', 'pre-wedding', 'ceremony'] },
    { name: 'Real Estate', keywords: ['real estate', 'property', 'architecture', 'interior', 'luxury homes'] },
    { name: 'Corporate', keywords: ['corporate', 'brand', 'commercial', 'business', 'event', 'keynote'] },
    { name: 'Travel', keywords: ['travel', 'tourism', 'destination', 'resort', 'hotel', 'adventure'] },
    { name: 'Fitness', keywords: ['fitness', 'gym', 'workout', 'sports', 'athlete', 'wellness'] }
  ];

  const foundSpecs = [];
  const lower = text.toLowerCase();

  for (const spec of specKeywords) {
    if (spec.keywords.some(kw => lower.includes(kw))) {
      foundSpecs.push(spec.name);
    }
  }

  return foundSpecs.length > 0 ? foundSpecs : ['Reel Creation', 'Short Videos'];
}

function calculateConfidence({ hasEmail, hasPhone, hasInstagram, hasLinkedin, text }) {
  let score = 0;
  if (hasEmail) score += 30;
  if (hasPhone) score += 25;
  if (hasInstagram) score += 25;
  if (hasLinkedin) score += 10;
  if (text.toLowerCase().includes('reel') || text.toLowerCase().includes('video')) score += 10;

  if (score >= 65) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

function getDomainName(url) {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

function sanitizeUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://${url}`;
}
