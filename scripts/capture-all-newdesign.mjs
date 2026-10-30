import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const pages = [
  { name: 'home', url: 'http://localhost:8080/' },
  { name: 'about', url: 'http://localhost:8080/about' },
  { name: 'what-we-do', url: 'http://localhost:8080/what-we-do' },
  { name: 'start-a-project', url: 'http://localhost:8080/start-a-project' },
  { name: 'shop', url: 'http://localhost:8080/shop' },
  { name: 'work', url: 'http://localhost:8080/work' },
  { name: 'work-detail', url: 'http://localhost:8080/work/afriteach' },
  { name: 'service-brand-identity', url: 'http://localhost:8080/services/brand-identity' },
  { name: 'service-physical-production', url: 'http://localhost:8080/services/physical-production' },
  { name: 'service-websites-digital', url: 'http://localhost:8080/services/websites-digital' },
  { name: 'service-marketing-growth', url: 'http://localhost:8080/services/marketing-growth' },
  { name: 'service-communication-content', url: 'http://localhost:8080/services/communication-content' },
  { name: 'ideas', url: 'http://localhost:8080/ideas' },
  { name: 'ideas-detail', url: 'http://localhost:8080/ideas/nobody-cares-about-your-logo' },
  { name: 'tools', url: 'http://localhost:8080/tools' },
  { name: 'lab', url: 'http://localhost:8080/lab' },
];

const viewports = [
  { prefix: 'desktop', size: '1440, 900' },
  { prefix: 'tablet', size: '768, 1024' },
  { prefix: 'mobile', size: '375, 812' },
];

const outDir = path.resolve('docs/newdesign');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`Starting new design capture for ${pages.length} pages across 3 viewports...`);

for (const vp of viewports) {
  console.log(`\n--- Capturing ${vp.prefix} (${vp.size}) ---`);
  for (const p of pages) {
    const outFile = path.join(outDir, `${vp.prefix}-${p.name}.png`);
    const cmd = `npx.cmd playwright screenshot --channel chrome --full-page --viewport-size "${vp.size}" "${p.url}" "${outFile}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
      process.stdout.write(`✓ ${vp.prefix}-${p.name} `);
    } catch (err) {
      console.error(`\n✗ Error capturing ${p.name}:`, err.message);
    }
  }
}

console.log('\n\nNew design capture complete! All screenshots saved in docs/newdesign/');
