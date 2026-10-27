#!/usr/bin/env node

const crypto = require('node:crypto');

const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:stockstobuynow.ai';
const sitemapUrl = process.env.GSC_SITEMAP_URL || 'https://www.stockstobuynow.ai/news-sitemap.xml';
const credentialsJson = process.env.GSC_SERVICE_ACCOUNT_JSON;

function base64Url(value) {
  return Buffer.from(value).toString('base64url');
}

async function main() {
  if (!credentialsJson) {
    console.log('Search Console submission skipped: GSC_SERVICE_ACCOUNT_JSON is not configured.');
    return;
  }

  const sitemapResponse = await fetch(sitemapUrl, { redirect: 'follow' });
  if (!sitemapResponse.ok) {
    throw new Error(`The live sitemap is unavailable (${sitemapResponse.status}): ${sitemapUrl}`);
  }

  const sitemap = await sitemapResponse.text();
  if (!sitemap.includes('<urlset') || !sitemap.includes('xmlns:news=')) {
    throw new Error(`The live file is not a Google News sitemap: ${sitemapUrl}`);
  }

  let credentials;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON is not valid JSON.');
  }

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('The Search Console service-account JSON is missing client_email or private_key.');
  }

  const now = Math.floor(Date.now() / 1000);
  const tokenUri = credentials.token_uri || 'https://oauth2.googleapis.com/token';
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: tokenUri,
    iat: now,
    exp: now + 3600,
  }));
  const unsignedJwt = `${header}.${claim}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsignedJwt), credentials.private_key).toString('base64url');

  const tokenResponse = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsignedJwt}.${signature}`,
    }),
  });
  const tokenPayload = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new Error(`Google OAuth failed (${tokenResponse.status}): ${tokenPayload.error_description || tokenPayload.error || 'unknown error'}`);
  }

  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const submitResponse = await fetch(endpoint, {
    method: 'PUT',
    headers: { authorization: `Bearer ${tokenPayload.access_token}` },
  });

  if (!submitResponse.ok) {
    const details = await submitResponse.text();
    throw new Error(
      `Search Console rejected the sitemap (${submitResponse.status}). ` +
      `Add ${credentials.client_email} as a user of ${siteUrl}. ${details}`,
    );
  }

  console.log(`Submitted ${sitemapUrl} to Google Search Console property ${siteUrl}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
