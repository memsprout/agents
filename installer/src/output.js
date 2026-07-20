import { ADD_COMMANDS, CONNECT_URL, SIGNUP_URL, APP_URL, SERVER_URL } from './content.js';
import { render } from './mcp-json.js';

export function cursorSnippet() {
  return render({ mcpServers: { memsprout: { url: SERVER_URL } } });
}

export function manualInstructions() {
  const snippet = cursorSnippet()
    .trimEnd()
    .split('\n')
    .map((line) => `                ${line}`);
  return [
    'Wire a client to memsprout by hand:',
    '',
    `  Claude Code   ${ADD_COMMANDS.claude.join(' ')}`,
    `  Codex         ${ADD_COMMANDS.codex.join(' ')}`,
    `  Gemini CLI    ${ADD_COMMANDS.gemini.join(' ')}`,
    '  Cursor        add to ~/.cursor/mcp.json:',
    ...snippet,
    '',
    `Then create an account at ${SIGNUP_URL} — each client opens a browser sign-in on first use.`,
    `Full instructions for every client: ${CONNECT_URL}`
  ].join('\n');
}

export function nextSteps(anythingSkipped) {
  const lines = [
    `1. Create an account at ${SIGNUP_URL} — the sign-in flow only signs in existing accounts, it does not create one.`,
    '2. Each client opens a browser sign-in the first time it talks to memsprout (Codex fallback: codex mcp login memsprout).',
    `3. Create a Shared Space for your team in the memsprout app (${APP_URL}) and invite members.`
  ];
  if (anythingSkipped) {
    lines.push(`Anything skipped or failed: ${CONNECT_URL}`);
  }
  return lines.join('\n');
}
