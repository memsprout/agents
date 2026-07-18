---
name: using-memsprout
description: >-
  Use memsprout — the user's persistent memory across sessions, tools, and
  agents — whenever a task could build on prior context or produces
  conclusions worth keeping. Search memories at the start of substantive
  tasks, capture durable conclusions at the end, and always search before
  storing to avoid duplicates. Triggers include "remember", "recall",
  "what did we decide", and any work the user will return to later.
---

# Using memsprout

memsprout is the user's persistent knowledge base, reachable as an MCP
server. It is shared memory: what you write is read later by the user, by
collaborators in shared spaces, and by other AI agents across many tools.
They trust it. Write accordingly — it is the user's externalised brain,
not a temporary scratchpad.

## The one rule

Store memories liberally, but omit the title by default. Everything you
record — observations, conclusions, summaries, decisions, even polished
write-ups and finished task results — goes through `store_memory` without
a title (a raw capture). Raw captures are cheap; no polish needed.

A titled memory is a deliberate authoring act. Add a title only when the
user explicitly asks for a durable, on-the-record write-up ("write this
up", "document this", "save this as a procedure"). Your own sense that
something is important or finished does not qualify — a raw capture holds
all of that fine. You can promote a raw capture later by adding a title
via `update_memory` once the user asks.

## Search first

- Call `search_memories` before assuming something isn't recorded, and
  before storing, so you don't create duplicates. It searches everything
  you can read by default.
- Use `list_memories` when you want recency browsing instead of
  meaning-based lookup.

## Workflow

1. At the start of a substantive task, search memsprout for relevant
   prior context.
2. When capturing into a space, check `list_topics` first and pass the
   best-fitting topic — don't rely on auto-classification as your first
   move.
3. Capture as raw memories (no title) — this covers almost everything,
   including the durable conclusion at the end of a task.
4. Add a title only when the user explicitly asks for a curated write-up.
5. Attach supporting files as assets on the relevant memory.

Be proactive: search at the start of a task and capture durable
conclusions at the end without waiting to be asked. Treat memsprout as
part of how the user thinks, not as an optional tool.

## Spaces and topics

Spaces are shared collaboration containers with member roles (owner /
editor / viewer). Pass `space_id` to `store_memory` to capture into a
space; omit it for the user's personal vault.

Every space memory is assigned to a topic. When capturing into a space,
check `list_topics` and pass the best-fitting existing topic — you know
the user's taxonomy better than a keyword match does. If nothing fits,
`create_topic` first (with a description), then pass it. Omit the topic
only as a last resort: the server auto-classifies as a backup, but
unmatched memories land in General.

## Assets

Files (images, audio, video, documents) attach to a memory; there is no
standalone file browse or search. New files: `get_signed_upload_url` →
PUT the bytes → `attach_asset` with the `storage_path` and `memory_id`.
Reuse existing files by `asset_id`. Network-restricted clients only:
`attach_asset` with `file_base64` (max 5 MB), or POST the bytes to
`/api/upload` (same base URL, `file` field) and register the returned
`storage_path` via `attach_asset`.

## Versioning

Memories are versioned: `update_memory` archives the prior state with an
optional `change_note`, so revise freely — history is never lost.

## Utilities

- `file_bug_report` — when the user describes a bug with memsprout
  itself, use this to open an issue on their behalf without them leaving
  the conversation.
- `memsprout_onboarding` — call this the first time a user sets up
  memsprout, or whenever they ask to onboard, get started, or seed a
  workspace from their existing context. It returns a guide to follow.
