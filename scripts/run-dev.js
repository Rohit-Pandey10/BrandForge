import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\x1b[36m%s\x1b[0m', '⚡ Starting Brand Builder Full-Stack (Server + Client)...');

// On Windows, use cmd /c to bypass PowerShell execution policy blocking npm.ps1
const isWindows = os.platform() === 'win32';

const server = spawn(
  isWindows ? 'cmd' : 'npm',
  isWindows ? ['/c', 'npm run dev'] : ['run', 'dev'],
  {
    cwd: path.join(rootDir, 'server'),
    stdio: 'inherit',
    shell: false
  }
);

const client = spawn(
  isWindows ? 'cmd' : 'npm',
  isWindows ? ['/c', 'npm run dev'] : ['run', 'dev'],
  {
    cwd: path.join(rootDir, 'client'),
    stdio: 'inherit',
    shell: false
  }
);

server.on('error', (err) => console.error('\x1b[31m[server] Failed to start:\x1b[0m', err.message));
client.on('error', (err) => console.error('\x1b[31m[client] Failed to start:\x1b[0m', err.message));

function cleanup() {
  console.log('\n\x1b[33m%s\x1b[0m', '🛑 Shutting down Brand Builder services...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
