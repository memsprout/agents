# memsprout for AI agents

[memsprout](https://memsprout.com) is a shared AI-context layer for teams —
persistent memory your agents search and update over MCP. Every agent and
tool you connect reads and writes the same knowledge base, so context
survives across sessions, models, and clients. This repo packages the
connection two ways: a Claude Code plugin (remote MCP server + a usage
skill) and a standalone [Agent Skill](https://agentskills.io) that works
in any client that reads `SKILL.md`.

## Before you install

Create an account at [memsprout.com](https://memsprout.com) first. The
OAuth sign-in that opens when a client first connects does **not** create
accounts — it only signs in existing ones.

## Claude Code

```
/plugin marketplace add memsprout/agents
/plugin install memsprout@memsprout
```

The plugin adds the memsprout MCP server and the `using-memsprout` skill.
The first connection opens the browser OAuth flow.

## claude.ai and Claude Desktop

Add memsprout as a custom connector: **Settings → Connectors → Add custom
connector**, with the server URL below. Sign in when the memsprout consent
screen opens.

## Agent Skill via skills.sh

```
npx skills add memsprout/agents
```

Installs the `using-memsprout` skill, which teaches your agent when and
how to use memsprout's tools. You still need the MCP server connected
(see below) — the skill describes the doctrine; the server provides the
tools.

## Cursor

The [`cursor/`](cursor/) directory has copy-in files for both motions:
merge `cursor/mcp.json` into `~/.cursor/mcp.json` for yourself, or commit
it as `.cursor/mcp.json` plus the `cursor/rules/memsprout.mdc` project
rule to your team's repo so every teammate's Cursor shares the same
memory. See [`cursor/README.md`](cursor/README.md).

## Any other MCP client

Point your client at the remote server:

```
https://mcp.memsprout.com/mcp
```

Streamable HTTP with OAuth 2.1 — clients that support MCP authorization
discover the sign-in flow automatically. Per-client wiring instructions
(Codex, Gemini CLI, Cursor, and more) are at
[memsprout.com/connect](https://memsprout.com/connect).

## What's in this repo

```
.claude-plugin/marketplace.json      Claude Code marketplace manifest
memsprout/                           the plugin
  .claude-plugin/plugin.json         plugin manifest
  .mcp.json                          remote MCP server config
  skills/using-memsprout/SKILL.md    usage skill
mcp-registry/                        official MCP Registry manifest + publish runbook
  server.json
  PUBLISH.md
cursor/                              Cursor setup files (individual + team)
  mcp.json                           MCP config — global or repo-committed
  rules/memsprout.mdc                always-applied project rule (memory doctrine)
```

## Support

- Product: [memsprout.com](https://memsprout.com)
- Issues with this plugin or skill: open an issue in this repo
