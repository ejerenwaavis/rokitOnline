import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const pages = [
  // Public
  { name: 'home', url: 'http://localhost:5005/' },
  { name: 'about', url: 'http://localhost:5005/about' },
  { name: 'services', url: 'http://localhost:5005/services' },
  { name: 'service-detail', url: 'http://localhost:5005/services/large-format-prints' },
  { name: 'gallery', url: 'http://localhost:5005/gallery' },
  { name: 'gallery-detail', url: 'http://localhost:5005/gallery/69b4afbc77dc854774a20256' },
  { name: 'photo-enhancer', url: 'http://localhost:5005/photo-enhancer' },
  { name: 'solutions-ngo', url: 'http://localhost:5005/solutions/ngo' },
  { name: 'solutions-sme', url: 'http://localhost:5005/solutions/sme' },
  { name: 'tutorials', url: 'http://localhost:5005/tutorials' },
  { name: 'contact', url: 'http://localhost:5005/contact' },
  { name: 'terms', url: 'http://localhost:5005/terms' },
  { name: 'privacy', url: 'http://localhost:5005/privacy' },
  { name: 'cookies', url: 'http://localhost:5005/cookies' },
  { name: 'auth-login', url: 'http://localhost:5005/auth/login' },
  { name: 'auth-register', url: 'http://localhost:5005/auth/register' },
  { name: 'auth-forgot-password', url: 'http://localhost:5005/auth/forgot-password' },

  // Customer portal
  { name: 'portal-dashboard', url: 'http://localhost:5005/portal', storage: 'docs/customer-storage.json' },
  { name: 'portal-new-order', url: 'http://localhost:5005/portal/orders/new', storage: 'docs/customer-storage.json' },
  { name: 'portal-new-quote', url: 'http://localhost:5005/portal/quotes/new', storage: 'docs/customer-storage.json' },
  { name: 'portal-new-design', url: 'http://localhost:5005/portal/designs/new', storage: 'docs/customer-storage.json' },

  // Admin portal
  { name: 'admin-dashboard', url: 'http://localhost:5005/admin', storage: 'docs/admin-storage.json' },
  { name: 'admin-orders', url: 'http://localhost:5005/admin/orders', storage: 'docs/admin-storage.json' },
  { name: 'admin-portfolio', url: 'http://localhost:5005/admin/portfolio', storage: 'docs/admin-storage.json' },
  { name: 'admin-tutorials', url: 'http://localhost:5005/admin/tutorials', storage: 'docs/admin-storage.json' },
  { name: 'admin-services', url: 'http://localhost:5005/admin/services', storage: 'docs/admin-storage.json' },
  { name: 'admin-customers', url: 'http://localhost:5005/admin/customers', storage: 'docs/admin-storage.json' },
  { name: 'admin-clients', url: 'http://localhost:5005/admin/clients', storage: 'docs/admin-storage.json' },
  { name: 'admin-media-bridge', url: 'http://localhost:5005/admin/media-bridge', storage: 'docs/admin-storage.json' },
];

const viewports = [
  { prefix: 'desktop', size: '1440, 900' },
  { prefix: 'tablet', size: '768, 1024' },
  { prefix: 'mobile', size: '375, 812' },
];

const outDir = path.resolve('docs/baseline');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`Starting baseline capture for ${pages.length} pages across 3 viewports...`);

for (const vp of viewports) {
  console.log(`\n--- Capturing ${vp.prefix} (${vp.size}) ---`);
  for (const p of pages) {
    const outFile = path.join(outDir, `${vp.prefix}-${p.name}.png`);
    const storageArg = p.storage ? `--load-storage "${p.storage}"` : '';
    const cmd = `npx.cmd playwright screenshot --channel chrome --full-page --viewport-size "${vp.size}" ${storageArg} "${p.url}" "${outFile}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
      process.stdout.write(`✓ ${vp.prefix}-${p.name} `);
    } catch (err) {
      console.error(`\n✗ Error capturing ${p.name}:`, err.message);
    }
  }
}

console.log('\n\nBaseline capture complete! All screenshots saved in docs/baseline/');
