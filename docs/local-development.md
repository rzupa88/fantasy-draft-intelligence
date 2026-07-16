# Local Development Contract

The project is developed in Git and the finished application runs locally on a laptop.

## Current Python foundation

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
pytest
ruff check .
black --check .
```

macOS or Linux:

```bash
source .venv/bin/activate
pip install -e ".[dev]"
pytest
ruff check .
black --check .
```

## Target root commands

As the TypeScript and desktop workspaces are introduced, the repository will provide root commands for:

```text
npm run setup
npm run test
npm run lint
npm run build
npm run dev
npm run package
npm run data:update
npm run data:validate
```

The commands must be implemented before they are advertised as operational in the root README.

## Packaged-user rule

Development commands are for contributors only. The released Windows application must launch through an installer-created shortcut and must not require Git, Python, Node, Rust, or a terminal on the user's machine.
