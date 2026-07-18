# Publishing memsprout to the MCP Registry

This is the manual runbook for publishing `server.json` to the official
MCP Registry (`registry.modelcontextprotocol.io`). It is **not** automated
and does **not** run in CI — someone with access to the memsprout.com
Cloudflare DNS zone runs these steps by hand.

**Before running this**, re-verify every step below against the live docs —
the registry is in preview and behavior can change. Canonical references:
`modelcontextprotocol.io/registry/quickstart`, `/registry/remote-servers`,
`/registry/authentication`, `/registry/versioning`, `/registry/faq`.

## 1. Install `mcp-publisher`

```sh
brew install mcp-publisher
```

Or use the curl-a-release-binary one-liner from the quickstart docs if
Homebrew isn't available.

## 2. Generate a keypair

```sh
openssl genpkey -algorithm Ed25519 -out key.pem
```

`key.pem` stays local and is gitignored (see `.gitignore` in this
directory) — it must never be committed. Stash it in the password manager
once generated. Losing it is recoverable: generate a new key and update
the DNS TXT record below, but that means re-verifying ownership from
scratch.

## 3. Derive the DNS TXT record value

```sh
PUBLIC_KEY="$(openssl pkey -in key.pem -pubout -outform DER | tail -c 32 | base64)"
```

The TXT record content is:

```
v=MCPv1; k=ed25519; p=${PUBLIC_KEY}
```

## 4. Add the DNS TXT record

Add it in Cloudflare DNS as a TXT record at the **apex** — name
`memsprout.com` (`@`), **not** a selector like `_mcp-auth.memsprout.com`.
The DKIM-style selector is a documented recurring publisher mistake; MCP
DNS auth reads the apex, the same way SPF does. Allow time for DNS
propagation before attempting login.

## 5. Why DNS verification, not HTTP `.well-known`

DNS verification grants the namespace **including all subdomains**; HTTP
verification grants only the exact domain. Confirmed in the registry
source: `internal/api/handlers/v0/auth/dns.go` sets `allowSubdomains =
true`, while `http.go` sets `false`. We want the `com.memsprout/*`
namespace broadly, so DNS is the right method here.

## 6. Log in

```sh
PRIVATE_KEY="$(openssl pkey -in key.pem -noout -text | grep -A3 "priv:" | tail -n +2 | tr -d ' :\n')"
mcp-publisher login dns --domain memsprout.com --private-key "${PRIVATE_KEY}"
```

## 7. Publish

```sh
mcp-publisher publish
```

Run this from `mcp-registry/` so `mcp-publisher` picks up the
hand-written `server.json` in this directory. Note: `mcp-publisher init`
also exists, but it generates a packages-oriented template — our
`server.json` already supersedes what it would produce, so there's no
need to run `init` first.

## 8. Verify

```sh
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=com.memsprout/memsprout"
curl "https://registry.modelcontextprotocol.io/v0.1/servers/com.memsprout%2Fmemsprout/versions/latest"
```

The server name must be URL-encoded in path params (`/` → `%2F`).

## 9. Versioning rules

Published versions are **immutable** — there is no unpublish/delete
(only registry moderation can flip a listing's `status`). Any metadata
fix requires publishing a new, unique version. The docs suggest
prerelease suffixes (e.g. `0.1.0-1`) for registry-only metadata updates,
but prereleases sort *before* the release they modify and won't be
marked "latest" if published after `0.1.0` — in practice, bump the patch
version instead (e.g. `0.1.1`) for post-publish fixes. Align future
version bumps with meaningful server releases where possible, and keep
this version in step with the plugin version in
`memsprout/.claude-plugin/plugin.json`.

## 10. Preview caveats

The registry is in **preview**: breaking changes or data resets may occur
before GA. Treat transient 5xx responses on publish as retryable. (An
earlier draft of this runbook claimed "502s are common in preview" — that
specific claim could not be corroborated in the registry issue tracker,
so treat this as a generic retry note rather than a documented fact.)
