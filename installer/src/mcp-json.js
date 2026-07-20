import { isDeepStrictEqual } from 'node:util';
import { SERVER_URL } from './content.js';

const ENTRY = { url: SERVER_URL };

// Decide how to bring `mcpServers.memsprout` into an mcp.json file
// without touching anything else in it. Pure — callers do the I/O.
// `unparseable` means the caller must leave the file alone and show the
// manual snippet instead.
export function merge(existingText) {
  if (existingText == null) {
    return { action: 'create', text: render({ mcpServers: { memsprout: ENTRY } }) };
  }
  let config;
  try {
    config = JSON.parse(existingText);
  } catch {
    return { action: 'unparseable' };
  }
  if (!isPlainObject(config) || ('mcpServers' in config && !isPlainObject(config.mcpServers))) {
    return { action: 'unparseable' };
  }
  const servers = config.mcpServers ?? {};
  if (isDeepStrictEqual(servers.memsprout, ENTRY)) {
    return { action: 'noop' };
  }
  config.mcpServers = { ...servers, memsprout: ENTRY };
  return { action: 'update', text: render(config) };
}

export function render(config) {
  return JSON.stringify(config, null, 2) + '\n';
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
