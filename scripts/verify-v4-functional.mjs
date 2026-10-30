import https from 'https';

const BASE_URL = 'https://v4.rokitonline.com';

const agent = new https.Agent({ rejectUnauthorized: false });

async function get(path) {
  return new Promise((resolve, reject) => {
    const req = https.get(`${BASE_URL}${path}`, { agent }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
  });
}

async function runTests() {
  console.log(`Starting Functional Verification against ${BASE_URL}...\n`);
  let passed = 0;
  let total = 0;

  async function check(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}: ${err.message}`);
    }
  }

  // TC-01: Health & DB connection
  await check('API Health Check (/api/health)', async () => {
    const res = await get('/api/health');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const json = JSON.parse(res.body);
    if (json.status !== 'ok') throw new Error(`Response: ${res.body}`);
    if (res.headers['x-robots-tag'] !== 'noindex, nofollow') throw new Error(`Missing X-Robots-Tag`);
  });

  // TC-02: Public services catalog API
  await check('Services API (/api/services)', async () => {
    const res = await get('/api/services');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const json = JSON.parse(res.body);
    if (!Array.isArray(json) || json.length === 0) throw new Error(`Expected services array, got: ${res.body.slice(0, 100)}`);
  });

  // TC-03: Portfolio API (isolated staging database)
  await check('Portfolio API (/api/portfolio)', async () => {
    const res = await get('/api/portfolio');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const json = JSON.parse(res.body);
    if (!Array.isArray(json)) throw new Error(`Expected portfolio array`);
  });

  // TC-04: Auth guard on protected endpoints
  await check('Auth Guard on /api/orders/mine (returns 401 when unauthenticated)', async () => {
    const res = await get('/api/orders/mine');
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // TC-05: SPA Routes returning HTML 200
  const routes = ['/', '/about', '/services', '/gallery', '/tutorials', '/contact', '/auth/login', '/portal'];
  for (const r of routes) {
    await check(`SPA Route (${r}) renders HTTP 200`, async () => {
      const res = await get(r);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      if (!res.body.includes('<div id="root"></div>')) throw new Error(`SPA root div not found`);
    });
  }

  // TC-06: Static V4 assets serving
  await check('V4 Static JS Bundle (/assets/index-D3agqEYI.js)', async () => {
    const res = await get('/assets/index-D3agqEYI.js');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  await check('V4 Static CSS Bundle (/assets/index-zl3we6hf.css)', async () => {
    const res = await get('/assets/index-zl3we6hf.css');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\nVerification Complete: ${passed}/${total} passed.`);
  if (passed !== total) process.exit(1);
}

runTests();
