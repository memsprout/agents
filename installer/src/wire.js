import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { run } from './run.js';
import { merge } from './mcp-json.js';
import { ADD_COMMANDS } from './content.js';
import { cursorDir } from './detect.js';

// Best-effort probe for an existing entry. A failed probe (including a
// CLI that lacks the subcommand) falls through to `add`, which
// overwrites its own same-name entry — so a re-run is a no-op either way.
function alreadyWired(client) {
  if (client === 'claude') return run('claude', ['mcp', 'get', 'memsprout']).ok;
  if (client === 'codex') return run('codex', ['mcp', 'get', 'memsprout']).ok;
  if (client === 'gemini') {
    const list = run('gemini', ['mcp', 'list']);
    return list.ok && list.stdout.includes('memsprout');
  }
  return false;
}

export function wire(client) {
  if (client === 'cursor') return wireCursor();
  if (alreadyWired(client)) return { client, status: 'already' };
  const [command, ...args] = ADD_COMMANDS[client];
  const result = run(command, args, { timeoutMs: 30000 });
  if (result.ok) return { client, status: 'wired' };
  const detail = (result.stderr || result.stdout || String(result.error ?? 'command failed')).trim();
  return { client, status: 'failed', detail };
}

function wireCursor() {
  const path = join(cursorDir(), 'mcp.json');
  const existing = existsSync(path) ? readFileSync(path, 'utf8') : null;
  const decision = merge(existing);
  if (decision.action === 'noop') return { client: 'cursor', status: 'already' };
  if (decision.action === 'unparseable') {
    return {
      client: 'cursor',
      status: 'failed',
      detail: `${path} exists but could not be parsed as JSON — left untouched. Add the entry by hand:`,
      manualSnippet: true
    };
  }
  writeFileSync(path, decision.text);
  return { client: 'cursor', status: 'wired' };
}
