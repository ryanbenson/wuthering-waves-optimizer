---
status: accepted
date: 2026-08-05
tags: [process, documentation]
---

# 1. Record architecture decisions as ADRs

## Context

The optimizer has many non-obvious choices (pure calculator, workers, store boundaries, content policy). Tribal knowledge lived in chat, scattered docs, and Serena memories. Humans and coding agents both need a single place to learn *why* something is the way it is — not only *how* the code is structured today.

## Decision

We record architecturally significant decisions as Markdown Architecture Decision Records under `docs/adr/`, using a light MADR-inspired template with YAML frontmatter (`status`, `date`, `tags`) and an explicit **Guidance** section aimed at contributors and agents.

Accepted ADRs are immutable in substance. Changes of mind produce a new ADR that supersedes the old one.

## Consequences

- Pros: Durable rationale; agents can be pointed at `docs/adr/` before proposing structural changes; reviews can cite ADR numbers.
- Cons: Docs can drift if people change code without updating or superseding ADRs; requires discipline on what is “significant.”

## Guidance

- **Do** add an ADR when introducing a cross-cutting pattern or reversing one.
- **Do** link related ADRs and code paths.
- **Don’t** rewrite history in an accepted ADR; supersede instead.
- **Don’t** ADR every PR — only lasting decisions (see [README](./README.md)).

## Related

- [docs/context.md](../context.md)
- [docs/architecture.md](../architecture.md)
- [CLAUDE.md](../../CLAUDE.md)
