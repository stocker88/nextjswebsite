#!/usr/bin/env node

const crypto = require('node:crypto');

const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:stockstobuynow.ai';
const sitemapUrl = process.env.GSC_SITEMAP_URL || 'https://www.stockstobuynow.ai/news-sitemap.xml';
const credentialsJson = process.env.GSC_SERVICE_ACCOUNT_JSON || process.env.GSC_OAUTH_JSON;

function base64Url(value) {
  return Buffer.from(value).toString('base64url');
}

async function main() {
  if (!credentialsJson) {
    console.log('Search Console submission skipped: no Google credential is configured.');
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

  const tokenUri = credentials.token_uri || 'https://oauth2.googleapis.com/token';
  let tokenRequest;

  if (credentials.client_email && credentials.private_key) {
    const now = Math.floor(Date.now() / 1000);
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
    tokenRequest = {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsignedJwt}.${signature}`,
    };
  } else if (credentials.client_id && credentials.client_secret && credentials.refresh_token) {
    tokenRequest = {
      grant_type: 'refresh_token',
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: credentials.refresh_token,
    };
  } else {
    throw new Error('The Google credential must be a service-account key or authorized-user OAuth JSON.');
  }

  const tokenResponse = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(tokenRequest),
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
    const principal = credentials.client_email || 'the authorized Google account';
    throw new Error(
      `Search Console rejected the sitemap (${submitResponse.status}). ` +
      `Confirm ${principal} can access ${siteUrl}. ${details}`,
    );
  }

  console.log(`Submitted ${sitemapUrl} to Google Search Console property ${siteUrl}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
