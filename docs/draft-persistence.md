# Draft Persistence Contract

## Purpose

A live draft must survive application closure without depending on a remote service. The draft engine therefore provides a versioned, self-contained JSON export that can later be stored in SQLite, written to disk, or used for manual backup.

## Schema version

The current export schema is `1.0`.

Unsupported schema versions are rejected explicitly rather than being interpreted optimistically.

## Export envelope

```json
{
  "schema_version": "1.0",
  "exported_at": "2026-07-16T15:30:00Z",
  "draft": {
    "draftId": "example-draft",
    "settings": {},
    "teams": [],
    "playerDataRelease": {},
    "pickPlayerIds": [],
    "revision": 0
  }
}
```

## Stored versus derived data

The export stores only the authoritative inputs required to reproduce the draft:

- draft ID
- league settings
- fantasy teams
- full versioned player-data release
- ordered canonical player IDs for completed picks
- revision number

The following fields are deliberately not stored because they are deterministic and can be rebuilt:

- snake-draft order
- roster-slot assignments
- available-player IDs
- current pick
- draft status

## Import behavior

Import does not trust derived state from a file. It:

1. Validates the export envelope and schema version.
2. Validates league settings, teams, and player data.
3. Creates a fresh draft state.
4. Replays every pick through the normal draft engine.
5. Recomputes roster allocation, availability, status, and the next pick.
6. Restores the saved revision after confirming it is valid.

This replay model catches duplicate players, unknown players, illegal roster construction, corrupt team settings, and altered pick histories.

## API

```ts
const json = serializeDraftState(state);
const restoredState = deserializeDraftState(json);
```

`serializeDraftState` also refuses to export an internally inconsistent in-memory state. This protects future persistence adapters from silently saving corrupted data.

## Future storage adapters

The desktop application can use the same serialization boundary for:

- SQLite autosave records
- `.json` backup files
- crash-recovery snapshots
- draft duplication and archival

Storage technology may change without changing the draft engine's persistence contract.
