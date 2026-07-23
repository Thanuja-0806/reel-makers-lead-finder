/**
 * Query Generator for Reel Makers & Short-Form Video Creators Lead Generation
 */

export function generateSearchQueries(city) {
  const cleanCity = (city || 'Mumbai').trim();

  return [
    `Reel makers in ${cleanCity}`,
    `Instagram reel creators in ${cleanCity}`,
    `Videographers in ${cleanCity}`,
    `Short video creators in ${cleanCity}`,
    `Content creators in ${cleanCity}`,
    `Social media videographers in ${cleanCity}`,
    `Digital marketing agencies in ${cleanCity}`,
    `Creative agencies in ${cleanCity}`,
    `Production houses in ${cleanCity}`,
    `Videography studios in ${cleanCity}`,
    `site:linkedin.com reel maker ${cleanCity}`,
    `site:instagram.com reel creator ${cleanCity}`,
    `site:justdial.com videographers ${cleanCity}`,
    `site:behance.net videographer ${cleanCity}`,
    `short form video agency ${cleanCity}`,
    `freelance videographers ${cleanCity}`,
    `influencer video agency ${cleanCity}`
  ];
}
