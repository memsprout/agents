import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { agentsSnippet, cursorRules, SERVER_URL } from '../src/content.js';
import { merge } from '../src/mcp-json.js';

// The canonical copies live one level up in this repo (cursor/, codex/).
// These tests turn doctrine drift between the installer and those files
// into a CI failure instead of a manual sync chore.
const canonical = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8');

test('shipped cursor rules match cursor/rules/memsprout.mdc byte for byte', () => {
  assert.equal(cursorRules(), canonical('../../cursor/rules/memsprout.mdc'));
});

test('shipped AGENTS.md snippet matches codex/AGENTS-snippet.md byte for byte', () => {
  assert.equal(agentsSnippet(), canonical('../../codex/AGENTS-snippet.md'));
});

test('generated cursor config matches cursor/mcp.json', () => {
  assert.deepEqual(JSON.parse(merge(null).text), JSON.parse(canonical('../../cursor/mcp.json')));
});

test('server url matches the canonical cursor config', () => {
  const theirs = JSON.parse(canonical('../../cursor/mcp.json'));
  assert.equal(SERVER_URL, theirs.mcpServers.memsprout.url);
});
