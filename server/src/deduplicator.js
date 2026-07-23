/**
 * Intelligent Deduplication Pipeline for Reel Makers Leads
 * Deduplicates by Name, Company Name, Website Domain, Instagram Handle, Email, or Phone Number.
 */
export function deduplicateLeads(leads) {
  const uniqueLeads = [];
  const seenKeys = new Set();

  for (const lead of leads) {
    // Generate normalized tracking keys
    const keysToTest = [];

    if (lead.email) {
      keysToTest.push(`email:${lead.email.toLowerCase().trim()}`);
    }
    if (lead.phone) {
      const cleanPhone = lead.phone.replace(/\D/g, '');
      if (cleanPhone.length >= 7) {
        keysToTest.push(`phone:${cleanPhone.slice(-10)}`);
      }
    }
    if (lead.instagramUrl) {
      const cleanInsta = extractInstaHandle(lead.instagramUrl);
      if (cleanInsta) {
        keysToTest.push(`insta:${cleanInsta}`);
      }
    }
    if (lead.websiteUrl) {
      const domain = getDomain(lead.websiteUrl);
      if (domain && domain !== 'instagram.com' && domain !== 'linkedin.com') {
        keysToTest.push(`domain:${domain}`);
      }
    }
    if (lead.companyName && lead.fullName) {
      const normCompany = lead.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normName = lead.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
      keysToTest.push(`namecompany:${normName}_${normCompany}`);
    }

    // Check if any key has been registered already
    const isDuplicate = keysToTest.some(k => seenKeys.has(k));

    if (!isDuplicate) {
      // Register all keys for this lead
      keysToTest.forEach(k => seenKeys.add(k));
      uniqueLeads.push(lead);
    } else {
      // Find existing lead and merge missing information
      const existing = uniqueLeads.find(l => 
        keysToTest.some(k => 
          (l.email && k === `email:${l.email.toLowerCase().trim()}`) ||
          (l.websiteUrl && k === `domain:${getDomain(l.websiteUrl)}`) ||
          (l.instagramUrl && k === `insta:${extractInstaHandle(l.instagramUrl)}`)
        )
      );

      if (existing) {
        // Merge missing fields
        if (!existing.phone && lead.phone) existing.phone = lead.phone;
        if (!existing.email && lead.email) existing.email = lead.email;
        if (!existing.instagramUrl && lead.instagramUrl) existing.instagramUrl = lead.instagramUrl;
        if (!existing.linkedinUrl && lead.linkedinUrl) existing.linkedinUrl = lead.linkedinUrl;
        if (!existing.portfolioUrl && lead.portfolioUrl) existing.portfolioUrl = lead.portfolioUrl;
        if (existing.confidenceScore === 'Low' && lead.confidenceScore !== 'Low') {
          existing.confidenceScore = lead.confidenceScore;
        }
      }
    }
  }

  return uniqueLeads;
}

function extractInstaHandle(url) {
  try {
    const matches = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
    return matches ? matches[1].toLowerCase() : '';
  } catch {
    return '';
  }
}

function getDomain(url) {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '').toLowerCase();
  } catch {
    return '';
  }
}
