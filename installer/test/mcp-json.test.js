import test from 'node:test';
import assert from 'node:assert/strict';
import { merge } from '../src/mcp-json.js';
import { SERVER_URL } from '../src/content.js';

test('creates a full config when the file is missing', () => {
  const result = merge(null);
  assert.equal(result.action, 'create');
  assert.deepEqual(JSON.parse(result.text), { mcpServers: { memsprout: { url: SERVER_URL } } });
  assert.ok(result.text.endsWith('\n'));
});

test('preserves other servers and unknown top-level keys', () => {
  const existing = JSON.stringify({ theme: 'dark', mcpServers: { other: { command: 'foo' } } });
  const result = merge(existing);
  assert.equal(result.action, 'update');
  const parsed = JSON.parse(result.text);
  assert.equal(parsed.theme, 'dark');
  assert.deepEqual(parsed.mcpServers.other, { command: 'foo' });
  assert.deepEqual(parsed.mcpServers.memsprout, { url: SERVER_URL });
});

test('already wired is a noop', () => {
  const existing = JSON.stringify({
    mcpServers: { memsprout: { url: SERVER_URL }, other: { command: 'foo' } }
  });
  assert.equal(merge(existing).action, 'noop');
});

test('same name with a different url is updated, not duplicated', () => {
  const existing = JSON.stringify({ mcpServers: { memsprout: { url: 'https://example.com' } } });
  const result = merge(existing);
  assert.equal(result.action, 'update');
  const parsed = JSON.parse(result.text);
  assert.deepEqual(parsed.mcpServers, { memsprout: { url: SERVER_URL } });
});

test('config without an mcpServers key gains one, keeping the rest', () => {
  const result = merge(JSON.stringify({ editor: { fontSize: 14 } }));
  assert.equal(result.action, 'update');
  const parsed = JSON.parse(result.text);
  assert.deepEqual(parsed.editor, { fontSize: 14 });
  assert.deepEqual(parsed.mcpServers.memsprout, { url: SERVER_URL });
});

test('invalid JSON is reported, never rewritten', () => {
  assert.equal(merge('{ "mcpServers": ').action, 'unparseable');
  assert.equal(merge('// jsonc comment\n{}').action, 'unparseable');
});

test('non-object shapes are reported, never rewritten', () => {
  assert.equal(merge('[]').action, 'unparseable');
  assert.equal(merge('"a string"').action, 'unparseable');
  assert.equal(merge(JSON.stringify({ mcpServers: [] })).action, 'unparseable');
});
