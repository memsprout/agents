import test from 'node:test';
import assert from 'node:assert/strict';
import { append, START_MARKER, END_MARKER } from '../src/agents-md.js';

const SNIPPET = '## memsprout — team memory\n\nUse it.';

test('creates AGENTS.md when missing', () => {
  const result = append(null, SNIPPET);
  assert.equal(result.action, 'create');
  assert.ok(result.text.startsWith(START_MARKER));
  assert.ok(result.text.trimEnd().endsWith(END_MARKER));
  assert.ok(result.text.includes(SNIPPET));
});

test('appends below existing content, wrapped in markers', () => {
  const result = append('# My project\n\nStuff.\n', SNIPPET);
  assert.equal(result.action, 'append');
  assert.ok(result.text.startsWith('# My project\n\nStuff.\n'));
  assert.ok(result.text.indexOf(START_MARKER) > 0);
  assert.ok(result.text.includes(SNIPPET));
});

test('adds a separating blank line when the file lacks a trailing newline', () => {
  const result = append('# My project', SNIPPET);
  assert.equal(result.action, 'append');
  assert.ok(result.text.startsWith(`# My project\n\n${START_MARKER}`));
});

test('noop when the marker is already present', () => {
  const first = append('# My project\n', SNIPPET);
  assert.equal(append(first.text, SNIPPET).action, 'noop');
});

test('noop when a hand-pasted copy without markers is present', () => {
  const existing = '# My project\n\n## memsprout — team memory\n\npasted by hand\n';
  assert.equal(append(existing, SNIPPET).action, 'noop');
});
