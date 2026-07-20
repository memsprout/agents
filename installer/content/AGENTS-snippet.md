## memsprout — team memory

memsprout is this team's persistent memory, connected as an MCP server.
What you store there is read later by teammates and by other AI agents
across many tools. They trust it — treat it as shared memory, not a
temporary scratchpad.

- Search first: call `search_memories` before assuming something isn't
  recorded, and before storing anything, so you don't create duplicates.
  Use `list_memories` for recency browsing.
- At the start of a substantive task, search memsprout for relevant
  prior context.
- Store memories liberally with `store_memory`. Give anything durable a
  concise, descriptive title — a decision, a procedure, a fact, a
  conclusion worth finding by name later. Leave the title off only for
  genuinely raw, ephemeral captures.
- At the end of a task, capture the durable conclusion — titled — without
  waiting to be asked.
- Shared work lives in Spaces; Topics organize memories within a Space.
  Only store into a shared Space the user has named in the current
  conversation — otherwise omit `space_id`, which defaults to personal.
