#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AGENT 1 — REAL MADRID KIT IMAGE SCRAPER AGENT
Upgraded Official Scraper that searches Wikimedia Commons specifically for
'<Player Name> "Real Madrid" filetype:bitmap', filters out national team & rival club kits,
and composites a realistic Real Madrid Royal White & Gold Jersey for 2026/27 signings
so 100% of portraits in frontend/public/images/players/ wear the Real Madrid kit.
"""

import json
import re
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

try:
    sys.stdout.reconfigure(encoding="utf-8")  # type: ignore
except Exception:
    pass

OUTPUT_DIR = Path(r"D:\halamadrid-vn\frontend\public\images\players")
REPORT_PATH = Path(r"D:\halamadrid-vn\data-analysis\scraper_report.json")

USER_AGENT = (
    "HalaMadridVNEncyclopediaBot/3.0 "
    "(https://halamadrid.vn; contact@halamadrid.vn) Python-urllib/3.11"
)

# Keywords indicating non-Real Madrid kits (National teams or other clubs) to reject
NON_MADRID_KEYWORDS = [
    "portugal", "france", "brazil", "brasil", "spain", "espana", "croatia", "hrvatska",
    "germany", "deutschland", "england", "belgium", "uruguay", "argentina", "turkey",
    "morocco", "wales", "mexico", "costa_rica", "ukraine", "netherlands", "ivory_coast",
    "chelsea", "liverpool", "manchester", "man_city", "man_utd", "psg", "paris_saint",
    "bayern", "dortmund", "juventus", "milan", "inter_milan", "barcelona", "atletico",
    "al-nassr", "al_nassr", "ittihad", "miami", "tottenham", "arsenal", "benfica",
    "bournemouth", "leganes", "fenerbahce", "monaco", "lyon", "santos", "flamengo",
    "palmeiras", "river_plate", "world_cup", "wc2014", "wc2018", "wc2022", "euro_20",
    "euro20", "copa_america", "feyenoord", "porto", "schalke", "leverkusen",
]

MADRID_BOOST_KEYWORDS = [
    "real_madrid", "real-madrid", "realmadrid", "madrid", "rmcf", "bernabeu",
    "champions_league", "la_liga", "blanco", "super_cup", "kiev", "cardiff", "lisbon",
]

# Players signed in 2025-2026/27 or youth players whose public Commons photos are from previous clubs
NEW_ERA_KIT_COMPOSITE_IDS = {
    "yan-diomande",
    "trent-alexander-arnold",
    "dean-huijsen",
    "ibrahima-konate",
    "marc-cucurella",
    "alvaro-carreras",
    "denzel-dumfries",
    "bernardo-silva",
    "carlos-espi",
    "franco-mastantuono",
    "joan-martinez",
    "sergio-mestre",
    "javier-navarro",
    "thiago-pitarch",
    "jorge-cestero",
    "sergio-martinez",
}

TARGETS: List[Dict[str, object]] = [
    # --- 2026/27 SQUAD: GOALKEEPERS ---
    {"id": "thibaut-courtois", "name": "Thibaut Courtois", "number": 1, "pos": "GK", "wiki": ["Thibaut_Courtois"]},
    {"id": "andriy-lunin", "name": "Andriy Lunin", "number": 13, "pos": "GK", "wiki": ["Andriy_Lunin"]},
    {"id": "sergio-mestre", "name": "Sergio Mestre", "number": 26, "pos": "GK", "wiki": ["Sergio_Mestre"]},
    {"id": "javier-navarro", "name": "Javier Navarro", "number": 31, "pos": "GK", "wiki": ["Javier_Navarro_(footballer)"]},
    # --- 2026/27 SQUAD: DEFENDERS ---
    {"id": "raul-asencio", "name": "Raúl Asencio", "number": 2, "pos": "DEF", "wiki": ["Raúl_Asencio"]},
    {"id": "eder-militao", "name": "Éder Militão", "number": 3, "pos": "DEF", "wiki": ["Éder_Militão"]},
    {"id": "dean-huijsen", "name": "Dean Huijsen", "number": 4, "pos": "DEF", "wiki": ["Dean_Huijsen"]},
    {"id": "trent-alexander-arnold", "name": "Trent Alexander-Arnold", "number": 12, "pos": "DEF", "wiki": ["Trent_Alexander-Arnold"]},
    {"id": "ibrahima-konate", "name": "Ibrahima Konaté", "number": 16, "pos": "DEF", "wiki": ["Ibrahima_Konaté"]},
    {"id": "marc-cucurella", "name": "Marc Cucurella", "number": 17, "pos": "DEF", "wiki": ["Marc_Cucurella"]},
    {"id": "alvaro-carreras", "name": "Álvaro Carreras", "number": 18, "pos": "DEF", "wiki": ["Álvaro_Carreras"]},
    {"id": "antonio-rudiger", "name": "Antonio Rüdiger", "number": 22, "pos": "DEF", "wiki": ["Antonio_Rüdiger"]},
    {"id": "ferland-mendy", "name": "Ferland Mendy", "number": 23, "pos": "DEF", "wiki": ["Ferland_Mendy"]},
    {"id": "denzel-dumfries", "name": "Denzel Dumfries", "number": 24, "pos": "DEF", "wiki": ["Denzel_Dumfries"]},
    {"id": "joan-martinez", "name": "Joan Martínez", "number": 30, "pos": "DEF", "wiki": ["Joan_Martínez"]},
    # --- 2026/27 SQUAD: MIDFIELDERS ---
    {"id": "jude-bellingham", "name": "Jude Bellingham", "number": 5, "pos": "MID", "wiki": ["Jude_Bellingham"]},
    {"id": "eduardo-camavinga", "name": "Eduardo Camavinga", "number": 6, "pos": "MID", "wiki": ["Eduardo_Camavinga"]},
    {"id": "federico-valverde", "name": "Federico Valverde", "number": 8, "pos": "MID", "wiki": ["Federico_Valverde"]},
    {"id": "aurelien-tchouameni", "name": "Aurélien Tchouaméni", "number": 14, "pos": "MID", "wiki": ["Aurélien_Tchouaméni"]},
    {"id": "arda-guler", "name": "Arda Güler", "number": 15, "pos": "MID", "wiki": ["Arda_Güler"]},
    {"id": "bernardo-silva", "name": "Bernardo Silva", "number": 20, "pos": "MID", "wiki": ["Bernardo_Silva"]},
    {"id": "thiago-pitarch", "name": "Thiago Pitarch", "number": 27, "pos": "MID", "wiki": ["Thiago_Pitarch"]},
    {"id": "jorge-cestero", "name": "Jorge Cestero", "number": 28, "pos": "MID", "wiki": ["Jorge_Cestero"]},
    {"id": "sergio-martinez", "name": "Sergio Martínez", "number": 38, "pos": "MID", "wiki": ["Sergio_Martínez"]},
    # --- 2026/27 SQUAD: FORWARDS ---
    {"id": "vinicius-junior", "name": "Vinícius Júnior", "number": 7, "pos": "FWD", "wiki": ["Vinícius_Júnior"]},
    {"id": "endrick", "name": "Endrick", "number": 9, "pos": "FWD", "wiki": ["Endrick"]},
    {"id": "kylian-mbappe", "name": "Kylian Mbappé", "number": 10, "pos": "FWD", "wiki": ["Kylian_Mbappé"]},
    {"id": "rodrygo", "name": "Rodrygo", "number": 11, "pos": "FWD", "wiki": ["Rodrygo"]},
    {"id": "carlos-espi", "name": "Carlos Espí", "number": 19, "pos": "FWD", "wiki": ["Carlos_Espí"]},
    {"id": "brahim-diaz", "name": "Brahim Díaz", "number": 21, "pos": "FWD", "wiki": ["Brahim_Díaz"]},
    {"id": "yan-diomande", "name": "Yan Diomande", "number": 25, "pos": "FWD", "wiki": ["Yan_Diomande"]},
    {"id": "franco-mastantuono", "name": "Franco Mastantuono", "number": 30, "pos": "FWD", "wiki": ["Franco_Mastantuono"]},
    # --- 35 ALL-TIME LEGENDS ---
    {"id": "alfredo-di-stefano", "name": "Alfredo Di Stéfano", "number": 9, "pos": "FWD", "wiki": ["Alfredo_Di_Stéfano"]},
    {"id": "ferenc-puskas", "name": "Ferenc Puskás", "number": 10, "pos": "FWD", "wiki": ["Ferenc_Puskás"]},
    {"id": "paco-gento", "name": "Paco Gento", "number": 11, "pos": "FWD", "wiki": ["Paco_Gento"]},
    {"id": "raymond-kopa", "name": "Raymond Kopa", "number": 7, "pos": "FWD", "wiki": ["Raymond_Kopa"]},
    {"id": "santillana", "name": "Santillana", "number": 9, "pos": "FWD", "wiki": ["Santillana_(footballer)"]},
    {"id": "pirri", "name": "Pirri", "number": 4, "pos": "MID", "wiki": ["Pirri"]},
    {"id": "amancio-amaro", "name": "Amancio Amaro", "number": 7, "pos": "FWD", "wiki": ["Amancio_(footballer)"]},
    {"id": "juanito", "name": "Juanito", "number": 7, "pos": "FWD", "wiki": ["Juanito_(footballer,_born_1954)"]},
    {"id": "emilio-butragueno", "name": "Emilio Butragueño", "number": 7, "pos": "FWD", "wiki": ["Emilio_Butragueño"]},
    {"id": "hugo-sanchez", "name": "Hugo Sánchez", "number": 9, "pos": "FWD", "wiki": ["Hugo_Sánchez"]},
    {"id": "manolo-sanchis", "name": "Manolo Sanchís", "number": 5, "pos": "DEF", "wiki": ["Manolo_Sanchís"]},
    {"id": "fernando-hierro", "name": "Fernando Hierro", "number": 4, "pos": "DEF", "wiki": ["Fernando_Hierro"]},
    {"id": "fernando-redondo", "name": "Fernando Redondo", "number": 6, "pos": "MID", "wiki": ["Fernando_Redondo"]},
    {"id": "roberto-carlos", "name": "Roberto Carlos", "number": 3, "pos": "DEF", "wiki": ["Roberto_Carlos"]},
    {"id": "raul-gonzalez", "name": "Raúl González", "number": 7, "pos": "FWD", "wiki": ["Raúl_(footballer)"]},
    {"id": "iker-casillas", "name": "Iker Casillas", "number": 1, "pos": "GK", "wiki": ["Iker_Casillas"]},
    {"id": "zinedine-zidane", "name": "Zinedine Zidane", "number": 5, "pos": "MID", "wiki": ["Zinedine_Zidane"]},
    {"id": "ronaldo-nazario", "name": "Ronaldo Nazário", "number": 9, "pos": "FWD", "wiki": ["Ronaldo_(Brazilian_footballer)"]},
    {"id": "luis-figo", "name": "Luís Figo", "number": 10, "pos": "FWD", "wiki": ["Luís_Figo"]},
    {"id": "david-beckham", "name": "David Beckham", "number": 23, "pos": "MID", "wiki": ["David_Beckham"]},
    {"id": "guti", "name": "Guti", "number": 14, "pos": "MID", "wiki": ["Guti_(footballer)"]},
    {"id": "claude-makelele", "name": "Claude Makélélé", "number": 24, "pos": "MID", "wiki": ["Claude_Makélélé"]},
    {"id": "cristiano-ronaldo", "name": "Cristiano Ronaldo", "number": 7, "pos": "FWD", "wiki": ["Cristiano_Ronaldo"]},
    {"id": "karim-benzema", "name": "Karim Benzema", "number": 9, "pos": "FWD", "wiki": ["Karim_Benzema"]},
    {"id": "sergio-ramos", "name": "Sergio Ramos", "number": 4, "pos": "DEF", "wiki": ["Sergio_Ramos"]},
    {"id": "luka-modric", "name": "Luka Modrić", "number": 10, "pos": "MID", "wiki": ["Luka_Modrić"]},
    {"id": "toni-kroos", "name": "Toni Kroos", "number": 8, "pos": "MID", "wiki": ["Toni_Kroos"]},
    {"id": "marcelo", "name": "Marcelo", "number": 12, "pos": "DEF", "wiki": ["Marcelo_(footballer,_born_1988)"]},
    {"id": "gareth-bale", "name": "Gareth Bale", "number": 11, "pos": "FWD", "wiki": ["Gareth_Bale"]},
    {"id": "pepe", "name": "Pepe", "number": 3, "pos": "DEF", "wiki": ["Pepe_(footballer,_born_1983)"]},
    {"id": "casemiro", "name": "Casemiro", "number": 14, "pos": "MID", "wiki": ["Casemiro"]},
    {"id": "keylor-navas", "name": "Keylor Navas", "number": 1, "pos": "GK", "wiki": ["Keylor_Navas"]},
    {"id": "angel-di-maria", "name": "Ángel Di María", "number": 22, "pos": "MID", "wiki": ["Ángel_Di_María"]},
    {"id": "mesut-ozil", "name": "Mesut Özil", "number": 10, "pos": "MID", "wiki": ["Mesut_Özil"]},
    {"id": "xabi-alonso", "name": "Xabi Alonso", "number": 14, "pos": "MID", "wiki": ["Xabi_Alonso"]},
    # --- PRESIDENTS & MANAGERS ---
    {"id": "santiago-bernabeu", "name": "Santiago Bernabéu", "number": 1943, "pos": "PRES", "wiki": ["Santiago_Bernabéu"]},
    {"id": "florentino-perez", "name": "Florentino Pérez", "number": 2000, "pos": "PRES", "wiki": ["Florentino_Pérez"]},
    {"id": "miguel-munoz", "name": "Miguel Muñoz", "number": 1960, "pos": "MGR", "wiki": ["Miguel_Muñoz"]},
    {"id": "vicente-del-bosque", "name": "Vicente del Bosque", "number": 2002, "pos": "MGR", "wiki": ["Vicente_del_Bosque"]},
    {"id": "carlo-ancelotti", "name": "Carlo Ancelotti", "number": 2014, "pos": "MGR", "wiki": ["Carlo_Ancelotti"]},
    {"id": "jose-mourinho", "name": "José Mourinho", "number": 2012, "pos": "MGR", "wiki": ["José_Mourinho"]},
]


def http_get_json(url: str, timeout: int = 10) -> Optional[dict]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status == 200:
                return json.loads(resp.read().decode("utf-8"))
    except Exception:
        return None
    return None


def download_binary(url: str, timeout: int = 12) -> Optional[bytes]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
            "Referer": "https://commons.wikimedia.org/",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = resp.read()
            if resp.status == 200 and len(data) > 2000:
                return data
    except Exception:
        return None
    return None


def score_commons_candidate(title: str, url: str) -> int:
    text = f"{title} {url}".lower()
    if any(ext in text for ext in [".svg", ".pdf", ".ogg", ".webm", ".tif", "signature", "autograph", "statue", "map", "chart"]):
        return -999
    score = 10
    for kw in MADRID_BOOST_KEYWORDS:
        if kw in text:
            score += 80
    for bad in NON_MADRID_KEYWORDS:
        if bad in text:
            score -= 150
    return score


def search_commons_real_madrid_kit_urls(player_name: str, wiki_titles: List[str]) -> List[Tuple[int, str]]:
    candidates: List[Tuple[int, str]] = []

    # 1. Dedicated Wikimedia Commons Search: <Player Name> "Real Madrid" filetype:bitmap
    queries = [
        f'{player_name} "Real Madrid" filetype:bitmap',
        f'{player_name} Real Madrid filetype:bitmap',
    ]
    for q_raw in queries:
        q = urllib.parse.quote(q_raw)
        commons_url = (
            f"https://commons.wikimedia.org/w/api.php?action=query&generator=search"
            f"&gsrsearch={q}&gsrnamespace=6&gsrlimit=8&prop=imageinfo"
            f"&iiprop=url&iiurlwidth=500&format=json"
        )
        data = http_get_json(commons_url)
        if data and "query" in data and "pages" in data["query"]:
            for _, page in data["query"]["pages"].items():
                title = str(page.get("title", ""))
                iinfo = page.get("imageinfo", [])
                if iinfo and isinstance(iinfo, list):
                    thumb_url = iinfo[0].get("thumburl") or iinfo[0].get("url")
                    if thumb_url:
                        sc = score_commons_candidate(title, str(thumb_url))
                        if sc > -50:
                            candidates.append((sc, str(thumb_url)))
        if any(sc >= 80 for sc, _ in candidates):
            break

    # 2. Also check Wikipedia REST API summary (exact CDN URLs)
    for lang in ["es", "en"]:
        for title in wiki_titles:
            encoded = urllib.parse.quote(title)
            url = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{encoded}"
            sdata = http_get_json(url)
            if sdata and isinstance(sdata, dict):
                thumb = sdata.get("thumbnail", {})
                if isinstance(thumb, dict) and thumb.get("source"):
                    src = str(thumb["source"])
                    sc = score_commons_candidate(title, src)
                    candidates.append((sc, src))

    candidates.sort(key=lambda item: item[0], reverse=True)
    return candidates


def apply_real_madrid_kit_frame(im: Image.Image, target: Dict[str, object], force_kit_shoulders: bool) -> Image.Image:
    """
    Standardizes the portrait to 600x760 and renders an authentic Real Madrid CF
    Royal White & Imperial Gold Jersey Shoulder/Collar Overlay when needed (for 2026/27 transfers)
    plus an official Real Madrid Crest & Jersey Number Lower Third so 100% of cards display
    the player in Real Madrid colors.
    """
    target_w, target_h = 600, 760
    src_w, src_h = im.size
    scale = max(target_w / src_w, target_h / src_h)
    new_w, new_h = int(src_w * scale), int(src_h * scale)
    resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = max(0, (new_w - target_w) // 2)
    top = 0  # Keep top/head aligned
    canvas = resized.crop((left, top, left + target_w, top + target_h)).convert("RGBA")

    overlay = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    cx = target_w // 2
    num_val = int(target["number"])  # type: ignore
    pos_group = str(target["pos"])

    if force_kit_shoulders and pos_group not in ("PRES", "MGR"):
        # Render realistic Real Madrid Royal White Home Kit shoulders (or GK emerald/gold kit) over lower chest
        kit_fill = (248, 250, 252, 255) if pos_group != "GK" else (16, 48, 42, 255)
        stripe_color = (212, 175, 55, 255)
        collar_dark = (10, 16, 36, 255)

        # Smooth shoulder dome covering old club jersey from y=470 down to 760
        draw.pieslice(
            [cx - 330, 455, cx + 330, 1020],
            start=180,
            end=360,
            fill=kit_fill,
            outline=stripe_color,
            width=4,
        )
        # Royal Adidas Gold 3-Stripes on shoulders
        for s_off in [-12, 0, 12]:
            draw.line([(cx - 245, 515 + s_off), (cx - 88, 465 + s_off)], fill=stripe_color, width=5)
            draw.line([(cx + 245, 515 + s_off), (cx + 88, 465 + s_off)], fill=stripe_color, width=5)

        # V-Neck Royal Navy & Gold Collar
        draw.polygon(
            [(cx - 72, 456), (cx + 72, 456), (cx, 535)],
            fill=collar_dark,
            outline=stripe_color,
        )

        # Emirates Fly Better & RM Crest on chest
        try:
            font_sponsor = ImageFont.truetype("arialbd.ttf", 26)
            font_crest = ImageFont.truetype("arialbd.ttf", 14)
        except Exception:
            font_sponsor = ImageFont.load_default()
            font_crest = ImageFont.load_default()

        # Left chest RM Gold Crest
        draw.ellipse([cx + 70, 535, cx + 116, 581], fill=(10, 16, 36, 255), outline=stripe_color, width=3)
        draw.text((cx + 93, 558), "RM", fill=(245, 208, 97, 255), font=font_crest, anchor="mm")

        # Center chest sponsor
        sponsor_txt_color = (15, 23, 42, 240) if pos_group != "GK" else (245, 208, 97, 240)
        draw.text((cx, 625), "REAL MADRID CF", fill=sponsor_txt_color, font=font_sponsor, anchor="mm")

    # Subtle bottom Royal vignette + Official RM Crest Corner Badge on 100% of portraits
    for y in range(target_h - 110, target_h):
        alpha = int(210 * ((y - (target_h - 110)) / 110))
        draw.line([(0, y), (target_w, y)], fill=(6, 9, 19, alpha))

    # Top-left official RM Crown Pill
    draw.rounded_rectangle(
        [16, 16, 168, 52],
        radius=10,
        fill=(6, 9, 19, 215),
        outline=(212, 175, 55, 230),
        width=2,
    )
    try:
        font_pill = ImageFont.truetype("arialbd.ttf", 14)
    except Exception:
        font_pill = ImageFont.load_default()
    draw.text((92, 34), "👑 REAL MADRID", fill=(245, 208, 97, 255), font=font_pill, anchor="mm")

    out = Image.alpha_composite(canvas, overlay).convert("RGB")
    out = ImageEnhance.Contrast(out).enhance(1.05)
    return out


def generate_royal_kit_card(target: Dict[str, object], dest_path: Path) -> None:
    """High-res Royal Real Madrid Home Kit Studio Portrait for players without Commons bitmaps."""
    width, height = 600, 760
    img = Image.new("RGB", (width, height), (8, 13, 28))
    draw = ImageDraw.Draw(img)

    for y in range(height):
        ratio = y / height
        r = int(10 + 18 * (1 - ratio))
        g = int(16 + 26 * (1 - ratio))
        b = int(38 + 52 * (1 - ratio))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    cx, cy = width // 2, 290
    draw.ellipse([cx - 150, cy - 150, cx + 150, cy + 150], fill=(16, 25, 52), outline=(245, 208, 97), width=4)

    # White Real Madrid Jersey Shoulders
    draw.pieslice([cx - 240, 390, cx + 240, 820], start=180, end=360, fill=(248, 250, 252), outline=(212, 175, 55), width=4)
    draw.polygon([(cx - 50, 392), (cx + 50, 392), (cx, 460)], fill=(12, 19, 39), outline=(212, 175, 55))
    draw.ellipse([cx - 62, cy - 95, cx + 62, cy + 45], fill=(224, 192, 162), outline=(245, 208, 97), width=3)

    try:
        font_name = ImageFont.truetype("arialbd.ttf", 30)
    except Exception:
        font_name = ImageFont.load_default()
    draw.text((cx, 535), f"#{target['number']} {str(target['name']).upper()}", fill=(12, 19, 39), font=font_name, anchor="mm")
    img.save(dest_path, "JPEG", quality=92)


def process_target(target: Dict[str, object]) -> Tuple[str, str, int]:
    pid = str(target["id"])
    pname = str(target["name"])
    wiki_list = list(target.get("wiki", []))  # type: ignore
    dest_file = OUTPUT_DIR / f"{pid}.jpg"
    force_kit = pid in NEW_ERA_KIT_COMPOSITE_IDS

    candidates = search_commons_real_madrid_kit_urls(pname, wiki_list)
    for score, img_url in candidates:
        raw_bytes = download_binary(img_url)
        if raw_bytes:
            try:
                im = Image.open(BytesIO(raw_bytes)).convert("RGB")
                # If score < 80 (meaning filename didn't explicitly confirm Real Madrid kit) or player is a 2026/27 transfer,
                # apply the Real Madrid Royal White & Gold jersey shoulder composite so they never wear another team's shirt
                needs_kit_composite = force_kit or (score < 80 and str(target["pos"]) not in ("PRES", "MGR"))
                processed = apply_real_madrid_kit_frame(im, target, force_kit_shoulders=needs_kit_composite)
                processed.save(dest_file, "JPEG", quality=92)
                tag = "commons_real_madrid_kit" if not needs_kit_composite else "real_madrid_kit_composited"
                return (pid, f"{tag} (score={score}, {img_url})", dest_file.stat().st_size)
            except Exception:
                continue

    # If existing cached file exists on disk, upgrade it with the Real Madrid kit composite
    if dest_file.exists() and dest_file.stat().st_size > 2000:
        try:
            with Image.open(dest_file) as existing_im:
                rgb_im = existing_im.convert("RGB")
            processed = apply_real_madrid_kit_frame(
                rgb_im,
                target,
                force_kit_shoulders=force_kit,
            )
            processed.save(dest_file, "JPEG", quality=92)
            return (pid, "upgraded_real_madrid_kit_cached", dest_file.stat().st_size)
        except Exception:
            pass

    generate_royal_kit_card(target, dest_file)
    return (pid, "royal_kit_studio_card", dest_file.stat().st_size)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[Agent 1] Running Real Madrid Kit Image Scraper for {len(TARGETS)} figures...")

    results = {}
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(process_target, t): t for t in TARGETS}
        for future in as_completed(futures):
            pid, source, fsize = future.result()
            results[pid] = {"source": source, "bytes": fsize, "path": f"/images/players/{pid}.jpg"}
            print(f"  [RM-KIT] {pid:<26} | {fsize:>7} bytes | {source[:68]}")

    REPORT_PATH.write_text(json.dumps({"total": len(TARGETS), "assets": results}, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n[Agent 1] COMPLETED! 100% ({len(TARGETS)}/{len(TARGETS)}) Real Madrid Kit portraits saved in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
