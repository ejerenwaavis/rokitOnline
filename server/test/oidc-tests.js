process.env.NODE_ENV = 'test';
process.env.ROKIT_ISSUER_URL = 'http://localhost:5099';
process.env.BYPASS_OIDC_MFA = 'true';
require('dotenv').config();

const crypto = require('crypto');
const http = require('http');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const app = require('../src/app');

class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  setFromResponse(res) {
    const raw = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    for (const cookieStr of raw) {
      const parts = cookieStr.split(';')[0].trim();
      const eqIdx = parts.indexOf('=');
      if (eqIdx > 0) {
        const name = parts.substring(0, eqIdx);
        const value = parts.substring(eqIdx + 1);
        this.cookies.set(name, value);
      }
    }
  }

  getCookieHeader() {
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }
}

function base64url(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generatePKCE() {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash('sha256').update(verifier).digest());
  return { verifier, challenge };
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  ROKIT MEDIA OPENID CONNECT PROVIDER (OIDC) TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Wait a moment for OIDC provider to initialize
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const TEST_PORT = 5099;
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  const baseUrl = `http://localhost:${TEST_PORT}`;

  let testsPassed = 0;
  let testsFailed = 0;

  async function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      testsFailed++;
    }
  }

  try {
    // 0. Seed test users
    await User.deleteMany({ email: { $in: ['test-active@rokitonline.com', 'test-suspended@rokitonline.com'] } });
    const activeUser = await User.create({
      name: 'Active Test User',
      email: 'test-active@rokitonline.com',
      password: 'Password123!',
      status: 'active',
      role: 'customer'
    });

    const suspendedUser = await User.create({
      name: 'Suspended Test User',
      email: 'test-suspended@rokitonline.com',
      password: 'Password123!',
      status: 'suspended',
      role: 'customer'
    });

    // TEST 1: Discovery Endpoint (.well-known/openid-configuration)
    console.log('[1/5] Testing OIDC Discovery & JWKS...');
    const discoRes = await fetch(`${baseUrl}/.well-known/openid-configuration`);
    const disco = await discoRes.json();
    await assert(discoRes.status === 200, 'Discovery endpoint returns 200');
    await assert(disco.authorization_endpoint.includes('/oauth/authorize'), 'Authorization endpoint advertised');
    await assert(disco.token_endpoint.includes('/oauth/token'), 'Token endpoint advertised');
    await assert(disco.userinfo_endpoint.includes('/oauth/userinfo'), 'Userinfo endpoint advertised');
    await assert(disco.jwks_uri.includes('/.well-known/jwks.json'), 'JWKS endpoint advertised');
    await assert(disco.code_challenge_methods_supported.includes('S256'), 'S256 PKCE method advertised');

    const jwksRes = await fetch(`${baseUrl}/.well-known/jwks.json`);
    const jwks = await jwksRes.json();
    await assert(jwksRes.status === 200 && Array.isArray(jwks.keys) && jwks.keys.length > 0, 'JWKS returns valid public keys');

    // TEST 2: Full Authorization Code + PKCE Flow
    console.log('\n[2/5] Testing Full Authorization Code + PKCE Flow...');
    const { verifier, challenge } = generatePKCE();
    const state = 'state_test_' + Date.now();
    const nonce = 'nonce_test_' + Date.now();
    const redirectUri = 'http://localhost:3000/api/auth/callback/rokit';

    // Step A: Initiate authorize request
    const jar = new CookieJar();
    const authUrl = `${baseUrl}/oauth/authorize?client_id=yanga_studio&response_type=code&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&nonce=${nonce}&code_challenge=${challenge}&code_challenge_method=S256`;
    const initAuthRes = await fetch(authUrl, { redirect: 'manual' });
    jar.setFromResponse(initAuthRes);
    const interactionRedirect = initAuthRes.headers.get('location');
    await assert(initAuthRes.status === 303 || initAuthRes.status === 302, 'Authorize redirects to interaction');
    await assert(interactionRedirect.includes('/interaction/'), 'Redirect target is /interaction/:uid');

    const uid = interactionRedirect.split('/interaction/')[1];

    // Step B: Submit login interaction
    const loginRes = await fetch(`${baseUrl}/interaction/${uid}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': jar.getCookieHeader()
      },
      body: JSON.stringify({
        email: 'test-active@rokitonline.com',
        password: 'Password123!'
      }),
      redirect: 'manual'
    });
    jar.setFromResponse(loginRes);

    const loginRedirect = loginRes.headers.get('location');
    await assert(loginRes.status === 302 || loginRes.status === 303, 'Login interaction finishes and redirects');

    // Step C: Follow redirect back to /oauth/authorize to receive code
    const followRes = await fetch(loginRedirect.startsWith('http') ? loginRedirect : `${baseUrl}${loginRedirect}`, {
      headers: { 'Cookie': jar.getCookieHeader() },
      redirect: 'manual'
    });
    jar.setFromResponse(followRes);

    const finalCallbackUrl = followRes.headers.get('location');
    if (!finalCallbackUrl) {
      console.log('Follow status:', followRes.status);
      console.log('Follow body:', await followRes.text());
    }
    await assert(finalCallbackUrl && finalCallbackUrl.startsWith(redirectUri), 'Provider redirects to Yanga redirect_uri');

    const cbUrlObj = new URL(finalCallbackUrl);
    const code = cbUrlObj.searchParams.get('code');
    const returnedState = cbUrlObj.searchParams.get('state');

    await assert(!!code, 'Authorization code returned in redirect');
    await assert(returnedState === state, 'State returned matches original state');

    // Step D: Exchange authorization code for tokens using PKCE verifier
    const tokenRes = await fetch(`${baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: 'yanga_studio',
        client_secret: process.env.YANGA_CLIENT_SECRET || 'yanga_secret_production_key_2026',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: verifier
      }).toString()
    });

    const tokenData = await tokenRes.json();
    await assert(tokenRes.status === 200, 'Token exchange succeeds with HTTP 200');
    await assert(!!tokenData.access_token, 'Access token issued');
    await assert(!!tokenData.id_token, 'ID token issued');
    await assert(tokenData.token_type === 'Bearer', 'Token type is Bearer');

    // Step E: Call userinfo endpoint
    const userinfoRes = await fetch(`${baseUrl}/oauth/userinfo`, {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });
    const userinfo = await userinfoRes.json();
    await assert(userinfoRes.status === 200, 'Userinfo returns 200');
    await assert(userinfo.sub === activeUser._id.toString(), 'Claims.sub matches stable internal user ID');
    await assert(userinfo.email === activeUser.email, 'Claims.email matches');
    await assert(userinfo.email_verified === true, 'Claims.email_verified is true');
    await assert(userinfo.status === 'active', 'Claims.status is active');
    await assert(userinfo.name === activeUser.name, 'Claims.name matches');

    // TEST 3: Rejected Redirect URI
    console.log('\n[3/5] Testing Rejected Redirect URI...');
    const badRedirectUrl = `${baseUrl}/oauth/authorize?client_id=yanga_studio&response_type=code&scope=openid&redirect_uri=https://evil-attacker.com/callback&state=test&code_challenge=${challenge}&code_challenge_method=S256`;
    const badRedirectRes = await fetch(badRedirectUrl, { redirect: 'manual' });
    await assert(badRedirectRes.status === 400 || badRedirectRes.status === 303, 'Rejected unregistered redirect URI');
    if (badRedirectRes.status === 303) {
      const loc = badRedirectRes.headers.get('location') || '';
      await assert(!loc.startsWith('https://evil-attacker.com'), 'Evil target rejected');
    }

    // TEST 4: Wrong PKCE Code Verifier
    console.log('\n[4/5] Testing Wrong PKCE Code Verifier...');
    const pkce2 = generatePKCE();
    const jar2 = new CookieJar();
    const authRes2 = await fetch(`${baseUrl}/oauth/authorize?client_id=yanga_studio&response_type=code&scope=openid%20email&redirect_uri=${encodeURIComponent(redirectUri)}&state=s2&nonce=n2&code_challenge=${pkce2.challenge}&code_challenge_method=S256`, { redirect: 'manual' });
    jar2.setFromResponse(authRes2);
    const uid2 = authRes2.headers.get('location').split('/interaction/')[1];

    const loginRes2 = await fetch(`${baseUrl}/interaction/${uid2}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': jar2.getCookieHeader() },
      body: JSON.stringify({ email: 'test-active@rokitonline.com', password: 'Password123!' }),
      redirect: 'manual'
    });
    jar2.setFromResponse(loginRes2);
    const follow2 = await fetch(loginRes2.headers.get('location'), { headers: { 'Cookie': jar2.getCookieHeader() }, redirect: 'manual' });
    jar2.setFromResponse(follow2);
    const code2 = new URL(follow2.headers.get('location')).searchParams.get('code');

    // Attempt exchange with WRONG verifier
    const badTokenRes = await fetch(`${baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: 'yanga_studio',
        client_secret: process.env.YANGA_CLIENT_SECRET || 'yanga_secret_production_key_2026',
        code: code2,
        redirect_uri: redirectUri,
        code_verifier: 'incorrect_wrong_code_verifier_12345678901234567890'
      }).toString()
    });

    const badTokenData = await badTokenRes.json();
    await assert(badTokenRes.status === 400, 'Wrong code verifier rejected with HTTP 400');
    await assert(badTokenData.error === 'invalid_grant', 'Error message is invalid_grant');

    // TEST 5: Expired Authorization Code
    console.log('\n[5/6] Testing Expired Authorization Code...');
    const pkceExp = generatePKCE();
    const jarExp = new CookieJar();
    const authResExp = await fetch(`${baseUrl}/oauth/authorize?client_id=yanga_studio&response_type=code&scope=openid%20email&redirect_uri=${encodeURIComponent(redirectUri)}&state=sexp&nonce=nexp&code_challenge=${pkceExp.challenge}&code_challenge_method=S256`, { redirect: 'manual' });
    jarExp.setFromResponse(authResExp);
    const uidExp = authResExp.headers.get('location').split('/interaction/')[1];

    const loginResExp = await fetch(`${baseUrl}/interaction/${uidExp}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': jarExp.getCookieHeader() },
      body: JSON.stringify({ email: 'test-active@rokitonline.com', password: 'Password123!' }),
      redirect: 'manual'
    });
    jarExp.setFromResponse(loginResExp);
    const followExp = await fetch(loginResExp.headers.get('location'), { headers: { 'Cookie': jarExp.getCookieHeader() }, redirect: 'manual' });
    jarExp.setFromResponse(followExp);
    const codeExp = new URL(followExp.headers.get('location')).searchParams.get('code');

    // Manually expire the code in Mongo
    const OidcPayload = require('../src/models/OidcPayload');
    await OidcPayload.updateMany(
      { type: 'AuthorizationCode' },
      { $set: { expiresAt: new Date(Date.now() - 5000) } }
    );

    const expiredTokenRes = await fetch(`${baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: 'yanga_studio',
        client_secret: process.env.YANGA_CLIENT_SECRET || 'yanga_secret_production_key_2026',
        code: codeExp,
        redirect_uri: redirectUri,
        code_verifier: pkceExp.verifier
      }).toString()
    });

    const expiredTokenData = await expiredTokenRes.json();
    await assert(expiredTokenRes.status === 400, 'Expired authorization code rejected with HTTP 400');
    await assert(expiredTokenData.error === 'invalid_grant', 'Expired code error message is invalid_grant');

    // TEST 6: Suspended User Blocked
    console.log('\n[6/6] Testing Suspended User Blocked...');
    const pkce3 = generatePKCE();
    const jar3 = new CookieJar();
    const authRes3 = await fetch(`${baseUrl}/oauth/authorize?client_id=yanga_studio&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(redirectUri)}&state=s3&code_challenge=${pkce3.challenge}&code_challenge_method=S256`, { redirect: 'manual' });
    jar3.setFromResponse(authRes3);
    const uid3 = authRes3.headers.get('location').split('/interaction/')[1];

    const suspendedLoginRes = await fetch(`${baseUrl}/interaction/${uid3}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': jar3.getCookieHeader() },
      body: JSON.stringify({ email: 'test-suspended@rokitonline.com', password: 'Password123!' }),
      redirect: 'manual'
    });

    await assert(suspendedLoginRes.status === 403, 'Suspended user blocked from completing authorization with HTTP 403');
    const suspBody = await suspendedLoginRes.json();
    await assert(suspBody.error && suspBody.error.includes('suspended'), 'Suspended error message returned');

  } finally {
    // Cleanup
    await User.deleteMany({ email: { $in: ['test-active@rokitonline.com', 'test-suspended@rokitonline.com'] } });
    server.close();
    await mongoose.connection.close();
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  OIDC TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('[FATAL TEST ERROR]', err);
  process.exit(1);
});
