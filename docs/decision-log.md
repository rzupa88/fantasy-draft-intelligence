# Decision Log

## 2026-07-16 — Local desktop delivery

**Decision:** Release the finished product as a locally installed laptop application rather than a hosted service.

**Consequences:**

- The live draft requires no remote server.
- Draft state is stored locally.
- The application must be tested with networking disabled.
- A packaged user does not need development tools.

## 2026-07-16 — Preserve the Python data foundation

**Decision:** Keep the existing Python ingestion and normalization work and add the live application incrementally.

**Consequences:**

- Python prepares versioned player-data releases.
- Python is not required during a packaged live draft.
- Existing canonical player IDs remain the cross-source identity key.

## 2026-07-16 — TypeScript domain engines

**Decision:** Implement draft-state and recommendation logic as interface-independent TypeScript packages.

**Consequences:**

- Logic can run in the desktop application without a Python process.
- Engines can be unit-tested separately from React and Tauri.
- Shared schemas reduce mismatch between interface and domain behavior.

## 2026-07-16 — React, Vite, Tauri, and SQLite

**Decision:** Use React/Vite for the interface, Tauri for native packaging, and SQLite for durable local persistence.

**Consequences:**

- The project retains web-development speed while producing a desktop installer.
- Draft saves use explicit database migrations and local backup/export.
- Tauri and Rust tooling are introduced only after the draft engine is stable.

## 2026-07-16 — Draft engine before interface

**Decision:** Do not build the visual draft room until a deterministic draft engine can complete simulated drafts.

**Consequences:**

- Snake ordering, picks, rosters, undo, correction, and serialization are verified before UI complexity is added.
- The first feature milestone is test-driven domain logic rather than mockups.
