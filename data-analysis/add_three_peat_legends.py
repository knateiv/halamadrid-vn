"""
Adds the 7 additional Three-Peat UCL (2015-2018) legends requested by the user:
  - Isco (#22)
  - Raphaël Varane (#5)
  - Dani Carvajal (#2)
  - Marco Asensio (#20)
  - Lucas Vázquez (#17)
  - Nacho Fernández (#6)
  - Mateo Kovačić (#16)
Downloads their portraits from Wikipedia/Wikimedia Commons into
D:/halamadrid-vn/frontend/public/images/players/<id>.jpg ONLY if the file does not
already exist (NEVER touches any existing user image file!), and appends their
full quantitative profiles + 6-axis radar percentiles to madrid_analytics.json.
"""

from __future__ import annotations

import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT_DIR / "frontend" / "public" / "images" / "players"
JSON_PATH = ROOT_DIR / "frontend" / "src" / "data" / "madrid_analytics.json"

USER_AGENT = "HalaMadridVN-Encyclopedia/3.2 (https://realmadrid.com; contact@halamadrid.vn)"

NEW_THREE_PEAT_LEGENDS = [
    {
        "id": "isco",
        "wiki_title": "Isco",
        "search_query": 'Isco "Real Madrid" filetype:bitmap',
        "name": "Isco Alarcón",
        "shirtNumber": 22,
        "category": "legend",
        "positionGroup": "MID",
        "specificPositions": ["AM", "CM", "LW"],
        "nationality": {"vi": "Tây Ban Nha", "en": "Spain", "flag": "🇪🇸"},
        "birthDate": "21/04/1992",
        "era": "2013–2022",
        "marketValue": "Legend (5x UCL)",
        "contractUntil": None,
        "imageUrl": "/images/players/isco.jpg",
        "stats": {
            "appearances": 353,
            "goals": 53,
            "assists": 56,
            "trophies": 19,
            "minutesPlayed": 20180,
            "topSpeedKmh": 31.8,
            "goalsPer90": 0.24,
            "assistsPer90": 0.25,
            "gaPer90": 0.49,
            "eraZScore": 1.62,
        },
        "radarPercentiles": {
            "scoring": 79,
            "creativity": 96,
            "progression": 97,
            "paceAndPhysical": 76,
            "defensiveWork": 68,
            "bigGameImpact": 94,
        },
        "bio": {
            "vi": "Phù thủy hộ công người Tây Ban Nha — hạt nhân sơ đồ 4-3-1-2 Kim cương của HLV Zinedine Zidane đá chính tại Chung kết Cardiff 2017 (thắng Juventus 4–1) và Kyiv 2018 (thắng Liverpool 3–1), giành 5 chức vô địch Champions League.",
            "en": "Spanish midfield magician and centerpiece of Zidane's 4-3-1-2 Diamond system in the 2017 Cardiff and 2018 Kyiv UCL Finals, winning 5 Champions League titles.",
        },
        "highlights": {
            "vi": [
                "Chìa khóa chiến thuật trong sơ đồ 4-3-1-2 Kim cương giúp Real Madrid nghiền nát Juventus 4–1 tại Chung kết C1 2017",
                "353 trận, 53 bàn thắng, 56 kiến tạo và 19 danh hiệu lớn (5 Champions League, 3 La Liga)",
                "Tỷ lệ giữ bóng thoát pressing trong không gian hẹp đạt nhóm phân vị 97/99 châu Âu mùa 2016/17",
            ],
            "en": [
                "Tactical linchpin of the 4-3-1-2 Diamond in the 4–1 2017 UCL Final win over Juventus",
                "353 appearances, 53 goals, 56 assists, and 19 major trophies (5x UCL)",
                "97th percentile in press-resistant ball progression during the 2016/17 Three-Peat peak",
            ],
        },
    },
    {
        "id": "raphael-varane",
        "wiki_title": "Raphaël_Varane",
        "search_query": '"Raphaël Varane" "Real Madrid" filetype:bitmap',
        "name": "Raphaël Varane",
        "shirtNumber": 5,
        "category": "legend",
        "positionGroup": "DEF",
        "specificPositions": ["CB"],
        "nationality": {"vi": "Pháp", "en": "France", "flag": "🇫🇷"},
        "birthDate": "25/04/1993",
        "era": "2011–2021",
        "marketValue": "Legend (4x UCL)",
        "contractUntil": None,
        "imageUrl": "/images/players/raphael-varane.jpg",
        "stats": {
            "appearances": 360,
            "goals": 17,
            "assists": 7,
            "trophies": 18,
            "minutesPlayed": 29850,
            "topSpeedKmh": 35.1,
            "goalsPer90": 0.05,
            "assistsPer90": 0.02,
            "gaPer90": 0.07,
            "eraZScore": 1.88,
        },
        "radarPercentiles": {
            "scoring": 64,
            "creativity": 72,
            "progression": 86,
            "paceAndPhysical": 97,
            "defensiveWork": 96,
            "bigGameImpact": 95,
        },
        "bio": {
            "vi": "Trung vệ tốc độ và lịch lãm bậc nhất lịch sử Real Madrid. Đá cặp ăn ý cùng Sergio Ramos tạo nên bức tường thép bảo vệ khung thành trong cả 3 trận Chung kết C1 liên tiếp (2016, 2017, 2018).",
            "en": "Elite high-speed French center-back who partnered Sergio Ramos at the heart of Real Madrid's defense across the 2016, 2017, and 2018 Champions League Three-Peat.",
        },
        "highlights": {
            "vi": [
                "Vô địch 4 Champions League và 18 danh hiệu trong 10 mùa giải khoác áo Hoàng gia (360 trận)",
                "Tốc độ bọc lót đạt 35.1 km/h — khắc tinh của mọi tiền đạo phản công tại châu Âu giai đoạn 2014–2018",
                "Đá trọn vẹn 90 phút cả hai trận Chung kết C1 Cardiff 2017 và Kyiv 2018",
            ],
            "en": [
                "4-time UEFA Champions League winner with 360 appearances and 18 trophies",
                "35.1 km/h recovery sprint speed neutralizing elite European counter-attacks",
                "Played full 90 minutes in both the 2017 Cardiff and 2018 Kyiv UCL Finals",
            ],
        },
    },
    {
        "id": "dani-carvajal",
        "wiki_title": "Dani_Carvajal",
        "search_query": '"Dani Carvajal" "Real Madrid" filetype:bitmap',
        "name": "Dani Carvajal",
        "shirtNumber": 2,
        "category": "legend",
        "positionGroup": "DEF",
        "specificPositions": ["RB"],
        "nationality": {"vi": "Tây Ban Nha", "en": "Spain", "flag": "🇪🇸"},
        "birthDate": "11/01/1992",
        "era": "2013–2026",
        "marketValue": "Legend (6x UCL)",
        "contractUntil": None,
        "imageUrl": "/images/players/dani-carvajal.jpg",
        "stats": {
            "appearances": 427,
            "goals": 14,
            "assists": 65,
            "trophies": 27,
            "minutesPlayed": 35600,
            "topSpeedKmh": 34.2,
            "goalsPer90": 0.04,
            "assistsPer90": 0.16,
            "gaPer90": 0.20,
            "eraZScore": 2.18,
        },
        "radarPercentiles": {
            "scoring": 66,
            "creativity": 92,
            "progression": 91,
            "paceAndPhysical": 90,
            "defensiveWork": 95,
            "bigGameImpact": 99,
        },
        "bio": {
            "vi": "Huyền thoại sống hành lang phải xuất thân từ lò La Fábrica (người đặt viên gạch đầu tiên xây trung tâm Valdebebas năm 2002). Kiến tạo bàn mở tỷ số cho Cristiano Ronaldo tại Chung kết C1 2017 và ghi bàn mở tỷ số Chung kết C1 2024, sở hữu 6 Cúp C1.",
            "en": "La Fábrica warrior and 6-time UEFA Champions League winner who assisted Ronaldo's opener in the 2017 Cardiff Final and scored the opener in the 2024 Wembley Final.",
        },
        "highlights": {
            "vi": [
                "Một trong những cầu thủ hiếm hoi trong lịch sử bóng đá thế giới giành 6 chức vô địch C1 / Champions League (đá chính cả 6 trận Chung kết)",
                "Kiến tạo siêu hạng cho Cristiano Ronaldo mở tỷ số trận Chung kết C1 2017 (thắng Juventus 4–1)",
                "427 trận, 65 kiến tạo và 27 danh hiệu cao quý cùng Real Madrid",
            ],
            "en": [
                "Started all 6 UEFA Champions League Finals he won (2014, 2016, 2017, 2018, 2022, 2024)",
                "Provided the crucial cutback assist for Ronaldo's opener in the 2017 UCL Final in Cardiff",
                "427 appearances, 65 assists, and 27 major titles",
            ],
        },
    },
    {
        "id": "marco-asensio",
        "wiki_title": "Marco_Asensio",
        "search_query": '"Marco Asensio" "Real Madrid" filetype:bitmap',
        "name": "Marco Asensio",
        "shirtNumber": 20,
        "category": "legend",
        "positionGroup": "FWD",
        "specificPositions": ["RW", "AM", "LW"],
        "nationality": {"vi": "Tây Ban Nha", "en": "Spain", "flag": "🇪🇸"},
        "birthDate": "21/01/1996",
        "era": "2016–2023",
        "marketValue": "Legend (3x UCL)",
        "contractUntil": None,
        "imageUrl": "/images/players/marco-asensio.jpg",
        "stats": {
            "appearances": 286,
            "goals": 61,
            "assists": 32,
            "trophies": 17,
            "minutesPlayed": 15940,
            "topSpeedKmh": 33.9,
            "goalsPer90": 0.34,
            "assistsPer90": 0.18,
            "gaPer90": 0.52,
            "eraZScore": 1.65,
        },
        "radarPercentiles": {
            "scoring": 91,
            "creativity": 86,
            "progression": 87,
            "paceAndPhysical": 84,
            "defensiveWork": 58,
            "bigGameImpact": 94,
        },
        "bio": {
            "vi": "Sát thủ có cái chân trái sấm sét của triều đại Ăn 3 C1. Người ấn định chiến thắng 4–1 trước Juventus ở phút 90 tại Chung kết Champions League 2017 (Cardiff) và ghi bàn quyết định vào lưới Bayern Munich tại Tứ kết & Bán kết C1 2017, 2018.",
            "en": "Thunderous left-footed forward of the Three-Peat dynasty who sealed the 4–1 victory over Juventus in the 2017 UCL Final and scored decisive knockout goals against Bayern Munich in 2017 and 2018.",
        },
        "highlights": {
            "vi": [
                "Ghi bàn ấn định tỷ số 4–1 tại Chung kết Champions League 2017 (Cardiff) khi mới 21 tuổi",
                "Ghi bàn ở cả Tứ kết C1 2016/17 và Bán kết C1 2017/18 vào lưới Bayern Munich trên đường giành cú ăn 3 C1",
                "286 trận, 61 bàn thắng, 32 kiến tạo và 17 danh hiệu (3 Champions League)",
            ],
            "en": [
                "Scored the 90th-minute 4–1 goal against Juventus in the 2017 UCL Final at age 21",
                "Scored decisive UCL knockout goals against Bayern Munich in both 2016/17 and 2017/18",
                "286 appearances, 61 goals, 32 assists, and 17 trophies (3x UCL)",
            ],
        },
    },
    {
        "id": "lucas-vazquez",
        "wiki_title": "Lucas_Vázquez",
        "search_query": '"Lucas Vázquez" "Real Madrid" filetype:bitmap',
        "name": "Lucas Vázquez",
        "shirtNumber": 17,
        "category": "legend",
        "positionGroup": "FWD",
        "specificPositions": ["RW", "RB"],
        "nationality": {"vi": "Tây Ban Nha", "en": "Spain", "flag": "🇪🇸"},
        "birthDate": "01/07/1991",
        "era": "2015–2025",
        "marketValue": "Legend (5x UCL)",
        "contractUntil": None,
        "imageUrl": "/images/players/lucas-vazquez.jpg",
        "stats": {
            "appearances": 362,
            "goals": 38,
            "assists": 65,
            "trophies": 22,
            "minutesPlayed": 21800,
            "topSpeedKmh": 34.0,
            "goalsPer90": 0.16,
            "assistsPer90": 0.27,
            "gaPer90": 0.43,
            "eraZScore": 1.58,
        },
        "radarPercentiles": {
            "scoring": 74,
            "creativity": 88,
            "progression": 86,
            "paceAndPhysical": 87,
            "defensiveWork": 84,
            "bigGameImpact": 95,
        },
        "bio": {
            "vi": "Chiến binh thầm lặng mang tinh thần thép của La Fábrica. Hình ảnh Lucas Vázquez xoay bóng trên ngón tay bước lên thực hiện thành công quả luân lưu đầu tiên tại Chung kết C1 Milan 2016 đã trở thành biểu tượng cho bản lĩnh lạnh lùng của thế hệ Ăn 3 C1.",
            "en": "Fearless La Fábrica utility star who famously spun the ball on his finger before burying the opening penalty in the 2016 Milan UCL Final shootout, winning 5 Champions League titles.",
        },
        "highlights": {
            "vi": [
                "Thực hiện thành công quả phạt đền đầu tiên mở màn loạt luân lưu thắng Atlético Madrid 5–3 tại Chung kết C1 2016",
                "Đóng góp 38 bàn thắng, 65 kiến tạo sau 362 trận và giành 5 chức vô địch Champions League",
                "Quân bài chiến thuật đa năng bậc nhất của HLV Zinedine Zidane từ tiền đạo cánh phải đến hậu vệ phải",
            ],
            "en": [
                "Converted the opening penalty in the 2016 UCL Final shootout win over Atlético Madrid",
                "362 appearances, 38 goals, 65 assists, and 5 UEFA Champions League titles",
                "Ultimate tactical swiss-army knife across right wing and right-back under Zidane",
            ],
        },
    },
    {
        "id": "nacho-fernandez",
        "wiki_title": "Nacho_(footballer,_born_1990)",
        "search_query": '"Nacho Fernández" "Real Madrid" filetype:bitmap',
        "name": "Nacho Fernández",
        "shirtNumber": 6,
        "category": "legend",
        "positionGroup": "DEF",
        "specificPositions": ["CB", "RB", "LB"],
        "nationality": {"vi": "Tây Ban Nha", "en": "Spain", "flag": "🇪🇸"},
        "birthDate": "18/01/1990",
        "era": "2011–2024",
        "marketValue": "Legend (6x UCL)",
        "contractUntil": None,
        "imageUrl": "/images/players/nacho-fernandez.jpg",
        "stats": {
            "appearances": 364,
            "goals": 16,
            "assists": 10,
            "trophies": 26,
            "minutesPlayed": 25900,
            "topSpeedKmh": 34.3,
            "goalsPer90": 0.06,
            "assistsPer90": 0.03,
            "gaPer90": 0.09,
            "eraZScore": 1.82,
        },
        "radarPercentiles": {
            "scoring": 62,
            "creativity": 70,
            "progression": 80,
            "paceAndPhysical": 89,
            "defensiveWork": 95,
            "bigGameImpact": 96,
        },
        "bio": {
            "vi": "Biểu tượng 'One-Club Man' suốt hơn 2 thập kỷ tại Real Madrid, giành trọn vẹn 6 chức vô địch Champions League và 26 danh hiệu. Tại Chung kết C1 Kyiv 2018, Nacho vào sân từ hiệp 1 thay Carvajal chấn thương và khóa chặt hành lang cánh của Liverpool.",
            "en": "Loyal La Fábrica captain and 6-time UEFA Champions League winner (26 trophies total) who stepped into the 2018 Kyiv UCL Final in the first half to lock down Real Madrid's defense.",
        },
        "highlights": {
            "vi": [
                "Sở hữu 6 chức vô địch Champions League và 26 danh hiệu lớn — nằm trong nhóm cầu thủ giàu thành tích nhất lịch sử CLB",
                "Vào sân từ phút 37 tại Chung kết C1 Kyiv 2018 (thắng Liverpool 3–1) và thi đấu xuất sắc suốt phần còn lại của trận đấu",
                "Đảm nhiệm hoàn hảo cả 4 vị trí nơi hàng phòng ngự trong suốt kỷ nguyên Ăn 3 C1 (2015–2018)",
            ],
            "en": [
                "6-time UEFA Champions League champion with 26 total club trophies",
                "Came on in the 37th minute of the 2018 Kyiv UCL Final and delivered a flawless defensive display",
                "Mastered all four defensive positions throughout the 2015–2018 Three-Peat era",
            ],
        },
    },
    {
        "id": "mateo-kovacic",
        "wiki_title": "Mateo_Kovačić",
        "search_query": '"Mateo Kovačić" "Real Madrid" filetype:bitmap',
        "name": "Mateo Kovačić",
        "shirtNumber": 16,
        "category": "legend",
        "positionGroup": "MID",
        "specificPositions": ["CM", "CDM"],
        "nationality": {"vi": "Croatia", "en": "Croatia", "flag": "🇭🇷"},
        "birthDate": "06/05/1994",
        "era": "2015–2018",
        "marketValue": "Legend (3x UCL)",
        "contractUntil": None,
        "imageUrl": "/images/players/mateo-kovacic.jpg",
        "stats": {
            "appearances": 109,
            "goals": 3,
            "assists": 8,
            "trophies": 10,
            "minutesPlayed": 5920,
            "topSpeedKmh": 34.4,
            "goalsPer90": 0.05,
            "assistsPer90": 0.12,
            "gaPer90": 0.17,
            "eraZScore": 1.48,
        },
        "radarPercentiles": {
            "scoring": 58,
            "creativity": 84,
            "progression": 96,
            "paceAndPhysical": 91,
            "defensiveWork": 86,
            "bigGameImpact": 88,
        },
        "bio": {
            "vi": "Động cơ tăng tốc tuyến giữa của kỷ nguyên Ăn 3 C1 (2015–2018). Gia nhập Real Madrid mùa hè 2015, tiền vệ người Croatia giành trọn 3 chức vô địch Champions League liên tiếp trong 3 mùa giải khoác áo Đội bóng Hoàng gia.",
            "en": "Explosive ball-carrying Croatian midfielder who joined in 2015 and won 3 consecutive UEFA Champions League titles across his 3 seasons at Real Madrid (2015/16, 2016/17, 2017/18).",
        },
        "highlights": {
            "vi": [
                "Hiệu suất vô địch C1 đạt 100% tại Real Madrid: 3 mùa giải khoác áo (2015/16, 2016/17, 2017/18) — 3 Cúp C1 liên tiếp",
                "Đá chính trong các trận đại chiến lượt về vòng 1/8 gặp PSG và Bán kết lượt về gặp Bayern Munich mùa 2017/18",
                "109 trận ra sân và sở hữu tỷ lệ kéo bóng qua người tuyến giữa đạt phân vị 96/99",
            ],
            "en": [
                "Won the UEFA Champions League in all 3 of his seasons at Real Madrid (2015/16, 2016/17, 2017/18)",
                "Started key 2017/18 UCL knockout clashes against PSG (Round of 16) and Bayern Munich (Semi-final)",
                "109 appearances with 96th-percentile central midfield ball progression",
            ],
        },
    },
]


def fetch_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download_image(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            if len(data) > 4000:
                dest.write_bytes(data)
                return True
    except Exception as exc:
        print(f"  [warn] Download failed {url}: {exc}")
    return False


def get_commons_or_wiki_portrait(wiki_title: str, search_query: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 4000:
        print(f"  [skip] {dest.name} already exists ({dest.stat().st_size} bytes)")
        return True

    # Try Wikipedia REST summary thumbnail first
    try:
        encoded = urllib.parse.quote(wiki_title)
        summary_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded}"
        summary = fetch_json(summary_url)
        img_url = (
            summary.get("originalimage", {}).get("source")
            or summary.get("thumbnail", {}).get("source")
        )
        if img_url and download_image(img_url, dest):
            print(f"  [ok] Downloaded {dest.name} from Wikipedia REST API")
            return True
    except Exception as exc:
        print(f"  [info] Wiki summary fallback for {wiki_title}: {exc}")

    # Fallback: Wikimedia Commons search
    try:
        params = urllib.parse.urlencode(
            {
                "action": "query",
                "generator": "search",
                "gsrsearch": search_query,
                "gsrnamespace": "6",
                "gsrlimit": "5",
                "prop": "imageinfo",
                "iiprop": "url",
                "iiurlwidth": "600",
                "format": "json",
            }
        )
        commons_url = f"https://commons.wikimedia.org/w/api.php?{params}"
        res = fetch_json(commons_url)
        pages = res.get("query", {}).get("pages", {})
        for page in pages.values():
            ii = page.get("imageinfo", [{}])[0]
            thumb = ii.get("thumburl") or ii.get("url")
            if thumb and download_image(thumb, dest):
                print(f"  [ok] Downloaded {dest.name} from Wikimedia Commons")
                return True
    except Exception as exc:
        print(f"  [warn] Commons search failed for {wiki_title}: {exc}")

    return False


def main() -> None:
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing_ids = {p["id"] for p in data["players"]}
    added_count = 0

    for item in NEW_THREE_PEAT_LEGENDS:
        dest_file = IMAGES_DIR / f"{item['id']}.jpg"
        get_commons_or_wiki_portrait(item["wiki_title"], item["search_query"], dest_file)

        player_entry = {k: v for k, v in item.items() if k not in ("wiki_title", "search_query")}
        if item["id"] not in existing_ids:
            data["players"].append(player_entry)
            existing_ids.add(item["id"])
            added_count += 1
        else:
            for idx, p in enumerate(data["players"]):
                if p["id"] == item["id"]:
                    data["players"][idx] = player_entry
                    break

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Added {added_count} new Three-Peat UCL legends. Total players in dataset: {len(data['players'])}")


if __name__ == "__main__":
    main()
