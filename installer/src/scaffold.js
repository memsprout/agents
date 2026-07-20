import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { merge } from './mcp-json.js';
import { append } from './agents-md.js';
import { agentsSnippet, cursorRules } from './content.js';

// Walk up from cwd looking for .git — a directory normally, a file in
// worktrees and submodules. No dependency on a git binary.
export function findRepoRoot(from = process.cwd()) {
  let dir = from;
  while (true) {
    if (existsSync(join(dir, '.git'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function scaffold(root) {
  return [scaffoldMcpJson(root), scaffoldRules(root), scaffoldAgentsMd(root)];
}

function scaffoldMcpJson(root) {
  const file = '.cursor/mcp.json';
  const path = join(root, '.cursor', 'mcp.json');
  const existing = existsSync(path) ? readFileSync(path, 'utf8') : null;
  const decision = merge(existing);
  if (decision.action === 'noop') return { file, action: 'unchanged' };
  if (decision.action === 'unparseable') {
    return { file, action: 'skipped', detail: 'existing file could not be parsed as JSON — left untouched' };
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, decision.text);
  return { file, action: decision.action === 'create' ? 'wrote' : 'merged' };
}

function scaffoldRules(root) {
  const file = '.cursor/rules/memsprout.mdc';
  const path = join(root, '.cursor', 'rules', 'memsprout.mdc');
  const content = cursorRules();
  if (existsSync(path)) {
    if (readFileSync(path, 'utf8') === content) return { file, action: 'unchanged' };
    return { file, action: 'skipped', detail: 'exists with different content — left untouched' };
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  return { file, action: 'wrote' };
}

function scaffoldAgentsMd(root) {
  const file = 'AGENTS.md';
  const path = join(root, 'AGENTS.md');
  const existing = existsSync(path) ? readFileSync(path, 'utf8') : null;
  const decision = append(existing, agentsSnippet());
  if (decision.action === 'noop') return { file, action: 'unchanged' };
  writeFileSync(path, decision.text);
  return { file, action: decision.action === 'create' ? 'wrote' : 'appended' };
}
