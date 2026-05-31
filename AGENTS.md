# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

HotKey is an AI real-time trending topic monitoring platform for content creators. Three independent sub-projects, each in its own git repo:

- **hotkey-server** — Go 1.25 + Gin backend (API, keyword management, source collection, content normalization, pgvector clustering, evidence chains, hotspot ranking, daily reports)
- **hotkey-web** — Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui web workbench
- **hotkey-miniapp** — Taro 4 + React 18 WeChat mini-program

Infrastructure: PostgreSQL + pgvector, Redis, Alibaba Cloud DashScope (Qwen models, text-embedding-v2).

## Common Commands

### hotkey-server (run from `hotkey-server/`)
```bash
go run ./cmd/server                          # Start server
HOTKEY_HTTP_ADDR=127.0.0.1:18080 go run ./cmd/server  # Custom address
go test ./...                                # Run all tests
go test ./internal/hotspot/...               # Run single package tests
curl http://127.0.0.1:18080/healthz          # Health check
curl http://127.0.0.1:18080/openapi.json     # Export OpenAPI spec
```

### hotkey-web (run from `hotkey-web/`)
```bash
npm run dev           # Dev server
npm run build         # Production build
npx tsc --noEmit      # Type check
npx openapi2ts        # Regenerate API client from server OpenAPI
python3 -m unittest discover -s tests   # Governance/contract tests
```

### hotkey-miniapp (run from `hotkey-miniapp/`)
```bash
npx taro build --type weapp            # Build WeChat mini-program
npx taro build --type weapp --watch    # Dev with watch
npx tsc --noEmit                       # Type check
npx openapi2ts                         # Regenerate API client
python3 -m unittest discover -s tests  # Governance/contract tests
```

## Architecture

### Cross-Repo API Contract
`hotkey-server` is the single source of truth for the API. Both frontends generate TypeScript clients from the server's OpenAPI spec (`/openapi.json`) using `@umijs/openapi`. Never hand-write backend API types in web or miniapp.

Generation order: server first, then web, then miniapp.

### Server Structure (hotkey-server/internal/)
- `httpapi/router.go` — Central Gin router, all 50+ endpoints, request/response types (most important file)
- `config/config.go` — Environment-based config loader
- `openapi/spec.go` — OpenAPI spec generation
- Domain packages: `keyword/`, `source/`, `content/`, `event/`, `eventgraph/`, `hotspot/`, `report/`, `trust/`, `propagation/`, `realtime/`, `redisinfra/`, `adminapi/`, `tenant/`, `rbac/`, `billing/`, `workqueue/`
- `db/schema.sql` — Full PostgreSQL schema (50+ tables with pgvector)

Currently all domain services use in-memory repositories; PostgreSQL/Redis persistence is being wired incrementally.

### Frontend Structure
- `hotkey-web/app/` — Next.js App Router (layout.tsx, page.tsx)
- `hotkey-web/src/components/CreatorWorkbench.tsx` — Main UI component
- `hotkey-web/src/services/hotkey/hotkey-server/` — Auto-generated API client
- `hotkey-miniapp/src/pages/index/` — Single-page miniapp
- `hotkey-miniapp/src/services/hotkey/hotkey-server/` — Auto-generated API client

### n8n Integration
`hotkey-server/n8n/` contains workflow definitions. The server exposes `/api/v1/internal/*` endpoints (authenticated via `HOTKEY_INTERNAL_API_KEY`) for n8n callbacks.

## Development Conventions

### TDD Workflow
Red-green-refactor. Commit order for feature branches:
1. `test:` — failing tests only (no production code)
2. `impl:` — minimal code to pass tests
3. `refactor:` — cleanup without behavior changes
4. `chore:` — config, formatting, generated files

### Single File Size
Keep files under 200-500 lines. Split by responsibility when a file grows beyond that.

### Documentation
- `docs/product/prd/` — PRDs (numbered 1-25)
- `docs/plans/` — Implementation plans (numbered 1-30)
- `docs/engineering/` — Technical design docs
- `docs/acceptance/` — Acceptance test docs
- Formal docs require YAML frontmatter with `layer`, `doc_no`, `audience`, `purpose`, etc.

### Git & PR
- Commit messages in Chinese
- PR granularity at Epic/milestone level, not individual task level
- PR descriptions must include: Test-first Evidence, Tests added, Commands run, Result, Agent Usage, Reviewer Checklist
- Before merging a PR, tag the target branch as a rollback point (e.g., `pre-merge-pr12-20260508`)

### Environment
Copy `hotkey-server/.env.example` to `.env` and configure. Key vars: `HOTKEY_HTTP_ADDR`, `HOTKEY_DATABASE_URL`, `HOTKEY_REDIS_URL`, `HOTKEY_DASHSCOPE_API_KEY`, `HOTKEY_INTERNAL_API_KEY`.
