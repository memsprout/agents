import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { run } from './run.js';

export const CLIENTS = [
  { id: 'claude', label: 'Claude Code' },
  { id: 'codex', label: 'Codex' },
  { id: 'gemini', label: 'Gemini CLI' },
  { id: 'cursor', label: 'Cursor' }
];

export function detect() {
  return {
    claude: hasCommand('claude'),
    codex: hasCommand('codex'),
    gemini: hasCommand('gemini'),
    cursor: existsSync(cursorDir())
  };
}

export function cursorDir() {
  return join(homedir(), '.cursor');
}

function hasCommand(command) {
  return run(command, ['--version'], { timeoutMs: 3000 }).ok;
}
