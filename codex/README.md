# memsprout for Codex

Wire Codex to [memsprout](https://memsprout.com) — the team's shared
memory over MCP — for yourself, and teach every agent working in your
repo the memory doctrine via `AGENTS.md`.

Accounts are created at [memsprout.com/signup](https://memsprout.com/signup)
first; the OAuth sign-in that opens on first connection does **not**
create accounts.

## Individual setup

```
codex mcp add memsprout --url https://mcp.memsprout.com/mcp
```

Codex detects OAuth and prompts to sign in; if it doesn't, run
`codex mcp login memsprout`.

The Codex CLI, IDE extension, and ChatGPT desktop app all read the same
`~/.codex/config.toml`, so this one command wires every Codex surface
([docs](https://developers.openai.com/codex/mcp)).

## Team setup

Append [`AGENTS-snippet.md`](AGENTS-snippet.md) to your repo's
`AGENTS.md` (create the file if it doesn't exist) and commit it — the
section teaches agents when to search and when to capture memory. The
`npx memsprout` installer offers the same append automatically.

MCP server config is per-user, not per-repo: each teammate runs the add
command above once and completes the OAuth sign-in the first time Codex
connects.

The snippet is deliberately client-agnostic. `AGENTS.md` is a
cross-agent convention ([agents.md](https://agents.md)), so any agent
that reads it — Codex, Jules, and others — follows the same doctrine.
