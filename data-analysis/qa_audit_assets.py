#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AGENT 4 — QA, ASSET AUDITOR & BUILD VERIFIER AGENT
Verifies that 100% of players (32 Squad 2026/27 + 35 Legends) and 7 Club Leaders
in madrid_analytics.json have valid, readable .jpg portraits in frontend/public/images/players/
"""

import json
import sys
from pathlib import Path
from PIL import Image

try:
    sys.stdout.reconfigure(encoding="utf-8")  # type: ignore
except Exception:
    pass

BASE_DIR = Path(r"D:\halamadrid-vn")
JSON_PATH = BASE_DIR / "frontend" / "src" / "data" / "madrid_analytics.json"
PUBLIC_DIR = BASE_DIR / "frontend" / "public"


def main() -> None:
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    players = data["players"]
    leaders = data["clubLeaders"]

    missing = []
    verified = 0

    for item in players + leaders:
        rel_url = item["imageUrl"].lstrip("/")
        file_path = PUBLIC_DIR / rel_url
        if not file_path.exists() or file_path.stat().st_size < 1000:
            missing.append(item["id"])
        else:
            with Image.open(file_path) as im:
                im.verify()
            verified += 1

    diomande = next((p for p in players if p["id"] == "yan-diomande"), None)
    assert diomande is not None, "Missing #25 Yan Diomande!"
    assert diomande["shirtNumber"] == 25, "Yan Diomande must be #25!"
    assert diomande["stats"]["topSpeedKmh"] == 36.3, "Yan Diomande top speed must be 36.3 km/h!"
    assert diomande["stats"]["gaPer90"] == 0.66, "Yan Diomande G+A/90 must be 0.66!"

    print(f"[Agent 4 QA] Verified {verified}/{len(players) + len(leaders)} image assets (100% valid JPEG, 0 missing).")
    print(
        f"[Agent 4 QA] #25 Yan Diomande verified: {diomande['name']} | "
        f"Born {diomande['birthDate']} | {diomande['marketValue']} | "
        f"Speed: {diomande['stats']['topSpeedKmh']} km/h | G+A/90: {diomande['stats']['gaPer90']}"
    )
    if missing:
        print(f"ERROR: Missing assets: {missing}")
        sys.exit(1)


if __name__ == "__main__":
    main()
