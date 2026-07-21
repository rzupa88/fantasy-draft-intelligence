from __future__ import annotations

import argparse
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compress a generated NFLverse JSON release for the draft-room application"
    )
    parser.add_argument("--input", type=Path, required=True, help="Generated NFLverse JSON release")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("apps/draft-room/public/data/nflverse-history-2025-2026.zip"),
        help="Bundled ZIP output path",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.input.is_file():
        raise FileNotFoundError(f"NFLverse JSON release was not found: {args.input}")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(args.output, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        archive.write(args.input, arcname=args.input.name)

    print(f"Bundled NFLverse release written: {args.output} ({args.output.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
