# memsprout for Cursor

Wire Cursor to [memsprout](https://memsprout.com) — the team's shared
memory over MCP — either for yourself or for your whole team via files
committed to your repo.

Accounts are created at [memsprout.com/signup](https://memsprout.com/signup)
first; the OAuth sign-in that opens on first connection does **not**
create accounts.

## Individual setup

Add the server globally, either via **Settings → Tools & MCP → New MCP
Server** or by merging [`mcp.json`](mcp.json) into `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "memsprout": {
      "url": "https://mcp.memsprout.com/mcp"
    }
  }
}
```

Cursor runs the browser OAuth flow automatically on first use.

## Team setup

Commit two files to your repo so every teammate's Cursor is wired the
same way, with no individual setup:

1. Copy [`mcp.json`](mcp.json) to `.cursor/mcp.json` at the repo root —
   Cursor reads project-scoped MCP config from there.
2. Copy [`rules/memsprout.mdc`](rules/memsprout.mdc) to
   `.cursor/rules/memsprout.mdc` — an always-applied project rule that
   teaches Cursor's agents when to search and capture memory.

Each teammate still completes the OAuth sign-in individually the first
time Cursor connects.
