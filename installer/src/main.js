import { readFileSync } from 'node:fs';
import { intro, outro, multiselect, confirm, isCancel, log, note } from '@clack/prompts';
import { detect, CLIENTS } from './detect.js';
import { wire } from './wire.js';
import { findRepoRoot, scaffold } from './scaffold.js';
import { manualInstructions, nextSteps, cursorSnippet } from './output.js';
import { CONNECT_URL } from './content.js';

export async function main(argv = process.argv.slice(2)) {
  if (argv.includes('-h') || argv.includes('--help')) {
    console.log(usage());
    return;
  }
  if (argv.includes('-v') || argv.includes('--version')) {
    console.log(version());
    return;
  }
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    console.log(manualInstructions());
    return;
  }

  intro('memsprout');

  const found = detect();
  const detected = CLIENTS.filter((c) => found[c.id]);
  const missing = CLIENTS.filter((c) => !found[c.id]);
  if (missing.length > 0) {
    log.info(`Not detected: ${missing.map((c) => c.label).join(', ')} — see ${CONNECT_URL} to wire them later.`);
  }
  if (detected.length === 0) {
    log.warn('No supported MCP clients detected on this machine.');
    console.log('\n' + manualInstructions() + '\n');
    outro('Nothing to wire yet.');
    return;
  }

  const selected = await multiselect({
    message: 'Wire memsprout into which clients?',
    options: detected.map((c) => ({ value: c.id, label: c.label })),
    initialValues: detected.map((c) => c.id),
    required: false
  });
  if (isCancel(selected)) return cancelled();

  const results = [];
  for (const client of selected) {
    const result = wire(client);
    results.push(result);
    const label = CLIENTS.find((c) => c.id === client).label;
    if (result.status === 'wired') {
      log.success(`${label}: wired to memsprout.`);
    } else if (result.status === 'already') {
      log.info(`${label}: already wired — no changes.`);
    } else {
      log.error(`${label}: ${result.detail}`);
      if (result.manualSnippet) console.log(cursorSnippet());
    }
  }

  const repoRoot = findRepoRoot();
  if (repoRoot) {
    const wantScaffold = await confirm({
      message: `Scaffold team files into this repo (${repoRoot})? Writes .cursor/mcp.json, .cursor/rules/memsprout.mdc, and an AGENTS.md snippet.`,
      initialValue: true
    });
    if (isCancel(wantScaffold)) return cancelled();
    if (wantScaffold) {
      for (const result of scaffold(repoRoot)) {
        if (result.action === 'unchanged') log.info(`${result.file}: already in place — no changes.`);
        else if (result.action === 'skipped') log.warn(`${result.file}: skipped — ${result.detail}.`);
        else log.success(`${result.file}: ${result.action}.`);
      }
    }
  }

  const failures = results.filter((r) => r.status === 'failed');
  const anythingSkipped = failures.length > 0 || missing.length > 0 || selected.length < detected.length;
  note(nextSteps(anythingSkipped), 'Next steps');

  if (results.length > 0 && failures.length === results.length) {
    outro('No clients could be wired — see above.');
    process.exitCode = 1;
  } else {
    outro('Done.');
  }
}

function cancelled() {
  outro(`Cancelled — nothing further was changed. Manual setup: ${CONNECT_URL}`);
}

function usage() {
  return [
    'Usage: npx memsprout',
    '',
    'Detects installed MCP clients (Claude Code, Codex, Gemini CLI, Cursor),',
    'wires each selected one to the memsprout server, and offers to scaffold',
    'team files (.cursor/mcp.json, .cursor/rules/memsprout.mdc, AGENTS.md',
    'snippet) into the current git repo.',
    '',
    'Non-destructive and idempotent: existing config entries are preserved,',
    'files that fail to parse are left untouched, and re-running makes no',
    'changes. Stores no credentials and makes no network calls.',
    '',
    'Options:',
    '  -h, --help     Show this help',
    '  -v, --version  Show the version'
  ].join('\n');
}

function version() {
  return JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
}
