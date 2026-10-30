import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('docs/content-pages-verification');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Starting preview server on port 5005...');
const server = spawn('npx.cmd', ['vite', 'preview', '--port', '5005', '--strictPort'], {
  cwd: path.resolve('client'),
  stdio: 'pipe',
  shell: true,
});

let serverStarted = false;

server.stdout.on('data', (d) => {
  const str = d.toString();
  if (str.includes('http://localhost:5005') || str.includes('5005')) {
    serverStarted = true;
  }
});

for (let i = 0; i < 20; i++) {
  if (serverStarted) break;
  await new Promise((r) => setTimeout(r, 250));
}

console.log('Preview server ready. Capturing screenshots...');

const pages = [
  { name: 'services', path: '/services' },
  { name: 'service-brand', path: '/services/brand-identity' },
  { name: 'service-physical', path: '/services/physical-production' },
  { name: 'terms', path: '/terms' },
];

try {
  for (const page of pages) {
    const outFile = path.join(outDir, `desktop-${page.name}.png`);
    const cmd = `npx.cmd playwright screenshot --channel chrome --full-page --viewport-size "1440, 900" "http://localhost:5005${page.path}" "${outFile}"`;
    try {
      execSync(cmd, { stdio: 'pipe', timeout: 30000 });
      console.log(`✓ Captured desktop-${page.name}.png`);
    } catch (err) {
      console.error(`✗ Failed to capture ${page.name}:`, err.message);
    }
  }
} finally {
  console.log('Shutting down preview server...');
  try {
    process.kill(-server.pid);
  } catch (e) {
    try {
      server.kill('SIGTERM');
    } catch (e2) {}
  }
  try {
    execSync('powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 5005 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force"', { stdio: 'ignore' });
  } catch (e) {}
  console.log('Server cleaned up.');
}
