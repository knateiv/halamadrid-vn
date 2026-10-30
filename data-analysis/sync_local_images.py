"""
HalaMadrid VN — Local Image Directory Scanner & 100% Exact Path Synchronizer
=============================================================================
Scans D:/halamadrid-vn/frontend/public/images/players/ (read-only on images!)
and synchronizes 100% of player, legend, and club leader imageUrl paths in:
  - D:/halamadrid-vn/frontend/src/data/madrid_analytics.json
  - D:/halamadrid-vn/data-analysis/seed_real_madrid_1902_2026.sql
to match the exact filenames and extensions (.jpg, .jpeg, .png, .webp, .avif)
provided by the user. Never overwrites or alters any user image file.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT_DIR / "frontend" / "public" / "images" / "players"
JSON_PATH = ROOT_DIR / "frontend" / "src" / "data" / "madrid_analytics.json"
SQL_PATH = ROOT_DIR / "data-analysis" / "seed_real_madrid_1902_2026.sql"

VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


def scan_local_images() -> dict[str, str]:
    """Return mapping of stem (e.g. 'cristiano-ronaldo') -> exact filename ('cristiano-ronaldo.jpg')."""
    if not IMAGES_DIR.exists():
        raise FileNotFoundError(f"Image directory not found: {IMAGES_DIR}")

    mapping: dict[str, str] = {}
    for file_path in sorted(IMAGES_DIR.iterdir()):
        if file_path.is_file() and file_path.suffix.lower() in VALID_EXTENSIONS:
            mapping[file_path.stem.lower()] = file_path.name
    return mapping


def main() -> None:
    file_map = scan_local_images()
    print(f"Scanned {len(file_map)} image files in {IMAGES_DIR}:")

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    matched_players = 0
    missing_players: list[str] = []

    for player in data.get("players", []):
        pid = player["id"].lower()
        if pid in file_map:
            exact_name = file_map[pid]
            player["imageUrl"] = f"/images/players/{exact_name}"
            matched_players += 1
        else:
            missing_players.append(pid)

    matched_leaders = 0
    missing_leaders: list[str] = []

    for leader in data.get("clubLeaders", []):
        lid = leader["id"].lower()
        if lid in file_map:
            exact_name = file_map[lid]
            leader["imageUrl"] = f"/images/players/{exact_name}"
            matched_leaders += 1
        else:
            missing_leaders.append(lid)

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # Also synchronize SQL seed file if any extension changed
    if SQL_PATH.exists():
        sql_text = SQL_PATH.read_text(encoding="utf-8")
        for stem, exact_filename in file_map.items():
            pattern = rf"/images/players/{re.escape(stem)}\.(?:jpg|jpeg|png|webp|avif)"
            sql_text = re.sub(pattern, f"/images/players/{exact_filename}", sql_text)
        SQL_PATH.write_text(sql_text, encoding="utf-8")

    print(f"Players & Legends matched: {matched_players}/{len(data.get('players', []))}")
    print(f"Club Leaders matched:      {matched_leaders}/{len(data.get('clubLeaders', []))}")

    if missing_players or missing_leaders:
        print("WARNING - Missing image files for IDs:", missing_players + missing_leaders)
        sys.exit(1)

    print("100% of Squad 2026/27, All-Time Legends, and Club Leaders match local image files!")


if __name__ == "__main__":
    main()
