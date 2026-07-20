# Repository Baseline Audit

## Scope

This audit records the initial state observed before building the offline draft application.

## Confirmed strengths

- Existing Python package configuration targets Python 3.11 or later.
- Historical data tooling already uses Pandas, Polars, DuckDB, Parquet, nflreadpy, and scikit-learn.
- The repository defines a canonical player ID layer.
- Cross-source player joins are intended to use `canonical_player_id`.
- Existing scripts cover ADP ingestion, nflverse ingestion, and player-reference construction.
- pytest, Ruff, and Black are already configured.
- The repository is private and the owner has full administrative and write permission.

## Baseline issues corrected in this branch

- The README contained conversational wrapper text and nested Markdown code fences.
- `pyarrow` was declared twice with different minimum versions.
- The existing README described a Codespaces-first research platform but did not define the local desktop delivery model.
- Product scope, offline rules, system boundaries, and milestone acceptance criteria were not recorded in repository documentation.

## Known audit limitations

The connected GitHub interface allowed direct inspection and editing of known repository paths but did not provide a complete recursive file-tree listing in this session. Runtime validation was also unavailable because the execution environment could not clone GitHub and did not include the GitHub CLI.

Accordingly, this branch makes only low-risk documentation and dependency-cleanup changes. Functional source-code changes will begin after the next implementation branch inspects the relevant files directly and adds executable draft-engine tests.

## Next audit actions

Before changing the Python data pipeline:

1. Inspect every module under `packages/data`.
2. Inspect every current test under `tests/data`.
3. Run the existing ingestion and test commands in an environment with repository checkout access.
4. Record current test counts and failures.
5. Confirm whether generated data files are intentionally tracked or ignored.
6. Add a CI workflow that reproduces the validated local commands.

## Baseline conclusion

The existing data foundation should be retained. The project should evolve incrementally into a monorepo, beginning with a separately testable TypeScript draft engine rather than restructuring or replacing the working Python pipeline.
