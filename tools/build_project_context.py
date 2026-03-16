from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "PROJECT_CONTEXT.md"

EXCLUDED_DIRS = {
    ".git",
    ".github",
    "node_modules",
    ".next",
    "dist",
    "build",
    ".venv",
    "venv",
    "__pycache__",
    ".pytest_cache",
    "coverage",
}

DOC_EXTENSIONS = {".md", ".txt"}
CODE_EXTENSIONS = {".py", ".ts", ".tsx", ".js", ".jsx"}

DOC_FOLDERS = ["docs"]
CODE_FOLDERS = ["src", "app", "packages", "api", "server", "client"]


def safe_read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return f"[Could not read {path.name}: {e}]"


def truncate(text: str, max_chars: int) -> str:
    return text if len(text) <= max_chars else text[:max_chars] + "\n\n[TRUNCATED]"


def is_excluded(path: Path) -> bool:
    return any(part in EXCLUDED_DIRS for part in path.parts)


def repo_tree(base: Path, max_depth: int = 3) -> str:
    lines: list[str] = []

    def walk(current: Path, prefix: str = "", depth: int = 0) -> None:
        if depth > max_depth:
            return

        children = sorted(
            [
                p
                for p in current.iterdir()
                if not p.name.startswith(".") and p.name not in EXCLUDED_DIRS
            ],
            key=lambda p: (p.is_file(), p.name.lower()),
        )

        for i, child in enumerate(children):
            connector = "└── " if i == len(children) - 1 else "├── "
            lines.append(f"{prefix}{connector}{child.name}")
            if child.is_dir() and depth < max_depth:
                extension = "    " if i == len(children) - 1 else "│   "
                walk(child, prefix + extension, depth + 1)

    walk(base)
    return "\n".join(lines)


def collect_docs() -> list[Path]:
    docs: list[Path] = []
    for folder_name in DOC_FOLDERS:
        folder = ROOT / folder_name
        if folder.exists():
            for path in folder.rglob("*"):
                if (
                    path.is_file()
                    and not is_excluded(path)
                    and path.suffix.lower() in DOC_EXTENSIONS
                ):
                    docs.append(path)
    return sorted(docs)


def collect_code() -> list[Path]:
    code: list[Path] = []
    for folder_name in CODE_FOLDERS:
        folder = ROOT / folder_name
        if folder.exists():
            for path in folder.rglob("*"):
                if (
                    path.is_file()
                    and not is_excluded(path)
                    and path.suffix.lower() in CODE_EXTENSIONS
                ):
                    code.append(path)
    return sorted(code)


def section(title: str, body: str) -> str:
    return f"## {title}\n\n{body.strip()}\n"


def main() -> None:
    parts: list[str] = []

    parts.append("# Fantasy Draft Intelligence — Project Context\n")
    parts.append(
        "This file is auto-generated from the repository "
        "to give ChatGPT Projects a compact view of the repo.\n"
    )

    readme = ROOT / "README.md"
    if readme.exists():
        parts.append(section("README", truncate(safe_read(readme), 12000)))
    else:
        parts.append(section("README", "README.md not found."))

    parts.append(section("Repository Structure", f"```text\n{repo_tree(ROOT)}\n```"))

    docs = collect_docs()
    if docs:
        doc_blocks = []
        for path in docs:
            rel = path.relative_to(ROOT)
            doc_blocks.append(f"### `{rel}`\n\n{truncate(safe_read(path), 8000)}")
        parts.append(section("Documentation", "\n\n".join(doc_blocks)))
    else:
        parts.append(section("Documentation", "No docs found in `docs/`."))

    metadata_blocks = []
    for filename in ["pyproject.toml", "package.json", "requirements.txt", "Makefile"]:
        path = ROOT / filename
        if path.exists():
            metadata_blocks.append(
                f"### `{filename}`\n\n```text\n{truncate(safe_read(path), 5000)}\n```"
            )

    if metadata_blocks:
        parts.append(section("Build and Dependency Files", "\n\n".join(metadata_blocks)))
    else:
        parts.append(
            section("Build and Dependency Files", "No build/dependency files found.")
        )

    code_files = collect_code()[:20]
    if code_files:
        code_blocks = []
        for path in code_files:
            rel = path.relative_to(ROOT)
            preview = "\n".join(safe_read(path).splitlines()[:80])
            code_blocks.append(f"### `{rel}`\n\n```text\n{truncate(preview, 3000)}\n```")
        parts.append(section("Important Source Files", "\n\n".join(code_blocks)))
    else:
        parts.append(section("Important Source Files", "No major source directories found."))

    OUTPUT.write_text("\n".join(parts).strip() + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()