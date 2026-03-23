from __future__ import annotations

from collections.abc import Iterable
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "PROJECT_CONTEXT.md"

EXCLUDED_DIRS = {
    ".git",
    ".github",
    ".venv",
    "venv",
    "__pycache__",
    ".pytest_cache",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".turbo",
    "coverage",
    ".mypy_cache",
    "fantasy_draft_intelligence.egg-info",
    ".ruff_cache",
}

DOC_EXTENSIONS = {".md", ".txt"}
CODE_EXTENSIONS = {
    ".py",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".yml",
    ".yaml",
    ".toml",
}
IMPORTANT_ROOT_FILES = [
    "README.md",
    "pyproject.toml",
    "Makefile",
    "config/settings.yaml",
]

SOURCE_FOLDERS = ["apps", "packages", "scripts", "tests"]
DOC_FOLDERS = ["docs"]
FANTASY_KEYWORDS = [
    "draft",
    "ranking",
    "rankings",
    "projection",
    "projections",
    "player",
    "players",
    "roster",
    "scoring",
    "adp",
    "tier",
    "tiers",
    "value",
    "vbd",
    "vols",
    "schedule",
    "stats",
]
DATA_KEYWORDS = [
    "data",
    "ingest",
    "import",
    "load",
    "etl",
    "scrape",
    "sync",
    "transform",
    "build_",
]
MAX_DOC_CHARS = 8000
MAX_FILE_PREVIEW_CHARS = 3500
MAX_CODE_FILES = 24
MAX_FANTASY_FILES = 12
MAX_DATA_FILES = 12


def safe_read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception as exc:
        return f"[Could not read {path}: {exc}]"


def truncate(text: str, max_chars: int) -> str:
    text = text.strip()
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rstrip() + "\n\n[TRUNCATED]"


def is_excluded(path: Path) -> bool:
    return any(part in EXCLUDED_DIRS for part in path.parts)


def iter_files(base: Path, extensions: set[str]) -> Iterable[Path]:
    if not base.exists():
        return
    for path in base.rglob("*"):
        if path.is_file() and not is_excluded(path) and path.suffix.lower() in extensions:
            yield path


def repo_tree(base: Path, max_depth: int = 3) -> str:
    lines: list[str] = []

    def walk(current: Path, prefix: str = "", depth: int = 0) -> None:
        if depth > max_depth:
            return

        children = sorted(
            [
                path
                for path in current.iterdir()
                if path.name not in EXCLUDED_DIRS and not path.name.startswith(".")
            ],
            key=lambda path: (path.is_file(), path.name.lower()),
        )

        for idx, child in enumerate(children):
            connector = "└── " if idx == len(children) - 1 else "├── "
            lines.append(f"{prefix}{connector}{child.name}")
            if child.is_dir() and depth < max_depth:
                extension = "    " if idx == len(children) - 1 else "│   "
                walk(child, prefix + extension, depth + 1)

    walk(base)
    return "\n".join(lines)


def section(title: str, body: str) -> str:
    return f"## {title}\n\n{body.strip()}\n"


def file_block(path: Path, max_chars: int = MAX_FILE_PREVIEW_CHARS) -> str:
    rel = path.relative_to(ROOT)
    content = truncate(safe_read(path), max_chars)
    return f"### `{rel}`\n\n```text\n{content}\n```"


def collect_root_files() -> list[Path]:
    return [ROOT / name for name in IMPORTANT_ROOT_FILES if (ROOT / name).exists()]


def collect_docs() -> list[Path]:
    docs: list[Path] = []
    for folder_name in DOC_FOLDERS:
        folder = ROOT / folder_name
        if folder.exists():
            docs.extend(iter_files(folder, DOC_EXTENSIONS))
    return docs


def score_doc_file(path: Path) -> int:
    rel = str(path.relative_to(ROOT)).lower()
    score = 0

    priority_terms = [
        "master_project_plan",
        "source_inventory",
        "architecture",
        "research",
        "runbooks",
        "adr",
    ]

    for term in priority_terms:
        if term in rel:
            score += 2

    return score


def collect_source_files() -> list[Path]:
    files: list[Path] = []
    for folder_name in SOURCE_FOLDERS:
        folder = ROOT / folder_name
        if folder.exists():
            files.extend(iter_files(folder, CODE_EXTENSIONS))
    return files


def score_source_file(path: Path) -> int:
    rel = str(path.relative_to(ROOT)).lower()
    score = 0

    priority_terms = [
        "packages/data/ingest",
        "packages/data/validation",
        "packages/modeling",
        "scripts/ingest",
        "scripts/validate",
        "tests/test",
        "apps/api",
        "apps/web",
    ]

    for term in priority_terms:
        if term in rel:
            score += 3

    if path.name == "__init__.py":
        score -= 2

    return score


def score_path(path: Path, keywords: list[str]) -> int:
    text = str(path.relative_to(ROOT)).lower()
    score = 0
    for keyword in keywords:
        if keyword in text:
            score += 1
    return score


def collect_matching_files(
    files: list[Path],
    keywords: list[str],
    limit: int,
) -> list[Path]:
    scored = [(score_path(path, keywords), path) for path in files]
    filtered = [item for item in scored if item[0] > 0]
    filtered.sort(key=lambda item: (-item[0], str(item[1]).lower()))
    return [path for _, path in filtered[:limit]]


def extract_quickstart(root_files: list[Path]) -> str:
    command_lines: list[str] = []

    for path in root_files:
        if path.name in {"README.md", "Makefile", "package.json", "pyproject.toml"}:
            content = safe_read(path)
            for line in content.splitlines():
                lower = line.lower().strip()
                if any(
                    token in lower
                    for token in [
                        "install",
                        "run",
                        "start",
                        "dev",
                        "test",
                        "lint",
                        "build",
                        "make ",
                        "pytest",
                        "uvicorn",
                        "streamlit",
                        "npm run",
                        "pnpm",
                        "poetry",
                    ]
                ):
                    command_lines.append(line.rstrip())

    unique_lines: list[str] = []
    seen: set[str] = set()
    for line in command_lines:
        normalized = line.strip()
        if normalized and normalized not in seen:
            seen.add(normalized)
            unique_lines.append(normalized)

    if not unique_lines:
        return (
            "No obvious quickstart commands were extracted. "
            "Check `README.md`, `Makefile`, and package files."
        )

    command_text = "\n".join(unique_lines[:60])
    return (
        "Potentially useful commands and setup hints found in project files:\n\n"
        f"```text\n{command_text}\n```"
    )


def build() -> str:
    parts: list[str] = []

    parts.append("# Fantasy Draft Intelligence — Project Context\n")
    parts.append(
        "This file is auto-generated to give ChatGPT a compact, practical "
        "understanding of the repository. It is meant to support feature "
        "planning, debugging, architecture discussions, and implementation help.\n"
    )

    root_files = collect_root_files()
    docs = sorted(
        collect_docs(),
        key=lambda path: (-score_doc_file(path), str(path).lower()),
    )
    source_files = sorted(
        collect_source_files(),
        key=lambda path: (-score_source_file(path), str(path).lower()),
    )

    readme = ROOT / "README.md"
    if readme.exists():
        parts.append(section("Project Summary", truncate(safe_read(readme), 12000)))
    else:
        parts.append(section("Project Summary", "README.md not found."))

    parts.append(section("Quickstart and Useful Commands", extract_quickstart(root_files)))
    parts.append(section("Repository Structure", f"```text\n{repo_tree(ROOT, max_depth=3)}\n```"))

    if root_files:
        parts.append(
            section(
                "Root Configuration and Dependency Files",
                "\n\n".join(file_block(path, 5000) for path in root_files),
            )
        )

    if docs:
        parts.append(
            section(
                "Key Documentation",
                "\n\n".join(file_block(path, MAX_DOC_CHARS) for path in docs[:20]),
            )
        )
    else:
        parts.append(section("Key Documentation", "No files found under `docs/`."))

    if source_files:
        parts.append(
            section(
                "Important Source Files",
                "\n\n".join(file_block(path) for path in source_files[:MAX_CODE_FILES]),
            )
        )
    else:
        parts.append(
            section(
                "Important Source Files",
                "No source files found in expected source folders.",
            )
        )

    fantasy_files = collect_matching_files(source_files, FANTASY_KEYWORDS, MAX_FANTASY_FILES)
    if fantasy_files:
        parts.append(
            section(
                "Fantasy Domain Logic Files",
                "\n\n".join(file_block(path) for path in fantasy_files),
            )
        )
    else:
        parts.append(
            section(
                "Fantasy Domain Logic Files",
                "No obviously fantasy-specific files were detected by filename. "
                "If domain logic lives in generic modules, update the generator rules.",
            )
        )

    data_files = collect_matching_files(source_files, DATA_KEYWORDS, MAX_DATA_FILES)
    if data_files:
        parts.append(
            section(
                "Data Pipeline and Ingestion Files",
                "\n\n".join(file_block(path) for path in data_files),
            )
        )
    else:
        parts.append(
            section(
                "Data Pipeline and Ingestion Files",
                "No obvious ingestion / ETL files were detected by filename.",
            )
        )

    test_files = [
        path
        for path in source_files
        if "test" in path.name.lower() or any(part.lower() == "tests" for part in path.parts)
    ]
    if test_files:
        parts.append(
            section(
                "Testing and Quality Signals",
                "\n\n".join(file_block(path, 2500) for path in test_files[:12]),
            )
        )
    else:
        parts.append(
            section(
                "Testing and Quality Signals",
                "No obvious test files were found in expected source folders.",
            )
        )

    notes = """
Use this file as the primary project snapshot for ChatGPT. Prefer relying on:
1. project summary and docs for intent
2. root config files for setup and tooling
3. fantasy domain logic files for business rules
4. data pipeline files for source-of-truth data flow

If responses start feeling stale, regenerate this file and re-upload it to the Project.
"""
    parts.append(section("Open Implementation Notes", notes))

    return "\n".join(parts).strip() + "\n"


if __name__ == "__main__":
    OUTPUT.write_text(build(), encoding="utf-8")
    print(f"Wrote {OUTPUT}")