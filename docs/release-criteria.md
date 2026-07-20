# Release Criteria

## M2 draft-engine release gate

- TypeScript packages build from a clean checkout.
- Unit tests cover snake order, picks, rosters, undo, correction, and serialization.
- A complete twelve-team draft simulation passes.
- Domain logic has no network, UI, or database dependency.

## v1.0 desktop release gate

- Windows installer builds successfully.
- Application launches without Python, Node, Git, or a terminal.
- A complete draft can be conducted with networking disabled.
- Autosave survives application closure and relaunch.
- Exported drafts can be imported into a clean installation.
- Duplicate and invalid picks cannot silently corrupt state.
- Player-data schema incompatibility produces a clear error.
- User documentation matches the released workflow.
