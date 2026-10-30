import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('docs/homepage-verification');
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

server.stderr.on('data', (d) => {
  // ignore or log
});

// Wait up to 5 seconds for server to start
for (let i = 0; i < 20; i++) {
  if (serverStarted) break;
  await new Promise((r) => setTimeout(r, 250));
}

console.log('Preview server ready. Capturing screenshots...');

const viewports = [
  { prefix: 'desktop', size: '1440, 900' },
  { prefix: 'tablet', size: '768, 1024' },
  { prefix: 'mobile', size: '375, 812' },
];

try {
  for (const vp of viewports) {
    const outFile = path.join(outDir, `${vp.prefix}-home.png`);
    const cmd = `npx.cmd playwright screenshot --channel chrome --full-page --viewport-size "${vp.size}" "http://localhost:5005/" "${outFile}"`;
    try {
      execSync(cmd, { stdio: 'pipe', timeout: 30000 });
      console.log(`✓ Captured ${vp.prefix}-home.png`);
    } catch (err) {
      console.error(`✗ Failed to capture ${vp.prefix}:`, err.message);
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
  // Also taskkill port 5005 if lingering
  try {
    execSync('powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 5005 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force"', { stdio: 'ignore' });
  } catch (e) {}
  console.log('Server cleaned up.');
}
