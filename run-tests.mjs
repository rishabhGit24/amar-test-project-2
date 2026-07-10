// Wrapper script so external runners that append Jest-style flags
// (e.g. --watchAll=false) don't break Vitest.
// We always invoke vitest with exactly: run
import { spawnSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const vitestBin = resolve(__dirname, 'node_modules', '.bin', 'vitest');

const result = spawnSync(vitestBin, ['run'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname,
});

process.exit(result.status ?? 1);
