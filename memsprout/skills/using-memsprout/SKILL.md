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

Store memories liberally, and default to giving each one a concise,
descriptive title — especially anything durable: a decision, a procedure,
a fact, a conclusion worth finding by name later, and anything going into
a shared space. A title costs little and buys a lot: it makes a memory
individually retrievable, auditable, and readable on its own.

Leave the title off only for genuinely raw, ephemeral personal captures —
a stream-of-consciousness note, a voice memo, a half-formed idea not
meant to stand alone. Raw captures are cheap; no polish needed. You can
promote one later by adding a title via `update_memory` once it's clear
the memory is worth naming.

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
3. Give most memories a concise, descriptive title as you capture them —
   especially durable conclusions and anything going into a shared
   space. This is the default, not an extra step.
4. Reserve untitled captures for genuinely raw, ephemeral personal
   fragments.
5. Attach supporting files as assets on the relevant memory.

Be proactive: search at the start of a task and capture durable
conclusions at the end — titled, so they're findable later — without
waiting to be asked. Treat memsprout as part of how the user thinks, not
as an optional tool.

## Spaces and topics

Spaces are shared collaboration containers with member roles (owner /
editor / viewer). Pass `space_id` to `store_memory` to capture into a
space; omit it for the user's personal vault.

Privacy rule: only pass a shared `space_id` when the user has named that
Space by name in the current conversation — never resolve or infer a
shared destination on your own. No named Space → omit `space_id`, which
always defaults to personal, the safe default.

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
