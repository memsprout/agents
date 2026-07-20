# memsprout installer

```
npx memsprout
```

Gets a developer from zero to wired in under a minute: detects which MCP
clients are installed, connects each selected one to
[memsprout](https://memsprout.com) — the shared AI-context layer for
teams — and offers to scaffold the team files into the current repo.

## What it does

1. **Detects** installed clients: Claude Code, Codex, and Gemini CLI on
   your PATH; Cursor via `~/.cursor/`. Anything not found gets a pointer
   to [memsprout.com/connect](https://memsprout.com/connect).
2. **Wires** each client you select:
   - Claude Code — `claude mcp add --transport http memsprout https://mcp.memsprout.com/mcp`
   - Codex — `codex mcp add memsprout --url https://mcp.memsprout.com/mcp`
   - Gemini CLI — `gemini mcp add --transport http memsprout https://mcp.memsprout.com/mcp`
   - Cursor — merges a `memsprout` entry into `~/.cursor/mcp.json`
3. **Offers team scaffolding** when run inside a git repo — commit these
   so every teammate's agents share the memory doctrine:
   - `.cursor/mcp.json` — project-scoped MCP config
   - `.cursor/rules/memsprout.mdc` — always-applied Cursor rule
   - `AGENTS.md` — appends a memsprout section (marker-wrapped, existing
     content untouched)
4. **Prints the human steps**: create an account at
   [memsprout.com/signup](https://memsprout.com/signup), complete each
   client's browser sign-in on first use, then create a Shared Space for
   your team and invite members.

## Guarantees

- **Non-destructive and idempotent.** JSON configs are read, merged, and
  written back with every other entry preserved. `AGENTS.md` is appended
  to, never rewritten. A file that fails to parse is left untouched and
  you get a manual snippet instead. Re-running after a successful run
  makes zero changes and says so.
- **No credentials.** The installer never sees or stores tokens —
  authentication is each client's own browser OAuth flow, on first use.
- **No network calls.** Everything it needs ships in the package.
- **Non-interactive safe.** Without a TTY (CI, pipes) it prints the
  manual setup commands and exits 0 instead of prompting.

## Requirements

Node 20 or newer.

## Development

```
npm test
```

Runs `node --test` over the pure merge/append logic plus parity checks
that the shipped doctrine files match the canonical copies in
[`cursor/`](../cursor/) one level up in this repo.
