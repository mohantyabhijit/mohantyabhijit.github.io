+++
title = "Harness Engineering: What Six Open Agent Codebases Teach About Production LLM Agents"
date = 2026-06-27T03:00:00+08:00
description = "A code-first synthesis of Codex, Goose, OpenCode, OpenClaw, NanoClaw, and Hermes, focused on the runtime around the model."
tags = ["ai", "agents", "engineering", "llms", "architecture"]
slug = "harness-engineering-production-llm-agents"
draft = false
+++

Most writing about agents starts with models. The code tells a different story.

I spent time reading six agent codebases: Codex, Goose, OpenCode, OpenClaw, NanoClaw, and Hermes. They differ in language, product surface, and philosophy. Codex is Rust-heavy and app-server shaped. Goose is a Rust MCP agent with desktop and text UI surfaces. OpenCode is a TypeScript/Bun/Effect runtime. OpenClaw is a wide TypeScript platform with gateway, plugins, policies, and native clients. NanoClaw is a host/container system where SQLite message files are the boundary. Hermes is a Python agent runtime with gateway, terminal, browser, desktop, and plugin surfaces.

Yet the same pattern kept appearing: the hard part is not the model call. The hard part is the harness around it.

The full source-backed PDF is available here: [Harness Engineering: A Code-First Guide to Production LLM Agents](/harness-engineering-guide/harness-engineering-guide-2026-06-27-rerender.pdf).

![Production agent architecture](/harness-engineering-guide/production-agent-architecture.svg)

## The agent loop is an operating system

A demo loop looks like this:

```text
while model wants tools:
  run tool
  send result back
```

The production loops I found look nothing like that. They admit input durably, serialize active work per session, build context, materialize tools, apply policy, stream one provider turn, persist tool calls before side effects, settle tool results, compact context, accept steering, recover from provider failures, and publish state to product surfaces.

That is not a helper function. It is an operating system for one unit of agent work.

Concrete examples from the longer guide:

- Codex's `codex-rs/core/src/session/turn.rs` owns compaction, context injection, tool construction, sampling, dispatch, and follow-up decisions.
- OpenCode's `packages/core/src/session/runner/llm.ts` separates durable prompt admission from execution and settles tools after one provider stream.
- NanoClaw's `container/agent-runner/src/poll-loop.ts` keeps provider continuation, inbound rows, outbound rows, and host delivery as explicit runtime state.

## Tools are capabilities, not functions

The mature systems separate model-visible tool definitions from executable registries. The schema is only the front door. Behind it are permission checks, stale-call detection, provider schema transforms, lifecycle hooks, progress metadata, output truncation, attachment handling, telemetry, and persistent result settlement.

If your tools are just Python or TypeScript functions in a dictionary, you have not built the tool system yet. You have built the function dispatch part.

![Tool invocation flow](/harness-engineering-guide/tool-invocation-flow.svg)

## Policy is a pipeline

The strongest systems do not have a single "allow tools" switch. They layer profile, provider, project, agent, group, sender, sandbox, inherited, and dynamic approval policy. Some use model-assisted read-only classification. Some use guardian review. Some keep dangerous command blocklists below any user-controlled yolo mode.

The practical lesson: permission decisions should be explainable. If a tool is blocked, the runtime should know which layer blocked it. If a command needs approval, the user should see the command, cwd, path, host, and risk.

## Context is runtime state

Context is not a string concatenation problem. These systems track prompt baselines, context epochs, world state, instruction files, memory sources, skill fragments, tool outputs, token estimates, compaction summaries, and prompt-cache boundaries.

Compaction is especially important. It is not a cleanup job. It changes control flow. A bad compaction retry can duplicate a user turn, lose tool results, or break provider prefix caching.

## Secrets belong below the model line

The model does not need raw credentials. It needs authorized operations.

The better patterns use keyrings, scoped secret maps, redaction, OneCLI-style credential gateways, request-time approval, and injected API headers. Secrets are kept out of broad child process environments when possible, and logs/snapshots are treated as hostile surfaces.

## Product UX is runtime UX

The UI should expose the same state machine the runtime uses: sampling, running tools, waiting for approval, compacting, interrupted, failed, blocked, delivered. If the UI can only show "thinking", users and operators are blind.

This is why terminals, desktop apps, web UIs, mobile clients, and channel adapters should all consume the same typed events and delivery records.

## The blueprint

A production agent harness needs:

- Durable sessions, turns, steps, tool calls, approvals, outputs, and deliveries.
- A single active-run coordinator per session.
- A model/provider adapter boundary.
- A tool registry with policy, hooks, settlement, truncation, and telemetry.
- Filesystem, network, shell, and secret authority represented as data.
- Context baselines, epochs, compaction, and prompt-cache discipline.
- User-facing state and approvals that mirror runtime state.
- Tests at the boundaries: policy, path resolution, parsers, tool settlement, compaction, replay, delivery, redaction, and provider fallback.

The model is important. But the harness is what makes the model production software.

I wrote the longer source-backed guide as a PDF and Markdown artifact from the same code-reading pass. It goes deeper into the six repositories, evidence matrix, and architecture diagrams.
