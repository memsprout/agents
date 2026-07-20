import { readFileSync } from 'node:fs';

export const SERVER_URL = 'https://mcp.memsprout.com/mcp';
export const SIGNUP_URL = 'https://memsprout.com/signup';
export const CONNECT_URL = 'https://memsprout.com/connect';
export const APP_URL = 'https://memsprout.com/app';

// These commands must stay identical to the /connect page in the product
// repo (web/src/routes/connect/+page.svelte) — that page is canonical.
export const ADD_COMMANDS = {
  claude: ['claude', 'mcp', 'add', '--transport', 'http', 'memsprout', SERVER_URL],
  codex: ['codex', 'mcp', 'add', 'memsprout', '--url', SERVER_URL],
  gemini: ['gemini', 'mcp', 'add', '--transport', 'http', 'memsprout', SERVER_URL]
};

const read = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8');

// Verbatim copy of ../cursor/rules/memsprout.mdc — enforced by
// test/content-parity.test.js.
export const cursorRules = () => read('../content/memsprout.mdc');

// Team snippet for AGENTS.md. Product-repo ticket #538 will ship the
// canonical AGENTS-snippet.md; converge on that file when it lands.
export const agentsSnippet = () => read('../content/AGENTS-snippet.md');
