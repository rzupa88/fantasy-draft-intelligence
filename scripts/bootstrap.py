from pathlib import Path

DIRECTORIES = [
    "data/raw",
    "data/intermediate",
    "data/processed",
    "artifacts/figures",
    "artifacts/reports",
    "artifacts/model_cards",
]

for directory in DIRECTORIES:
    Path(directory).mkdir(parents=True, exist_ok=True)

print("Bootstrap complete.")
