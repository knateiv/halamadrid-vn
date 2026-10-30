"""
Enriches all 74 players in D:/halamadrid-vn/frontend/src/data/madrid_analytics.json
with the 12 standardized biographical & physical attributes required for the
2-Column Player Profile Modal:
  1. imageUrl (Avatar)
  2. fullName (Full official legal name)
  3. birthDateAndAge (DD/MM/YYYY — XX tuổi / Lifespan for deceased legends)
  4. nationality (Flag + Country name)
  5. clubName (Current club or Real Madrid CF Legend status)
  6. shirtNumber (#XX)
  7. positionFull (Vietnamese & English full position label + tactical codes)
  8. height (X,XX m)
  9. weight (XX kg)
 10. preferredFoot (Chân phải / Chân trái / Cả hai chân)
 11. marketValue (Transfermarkt valuation or Peak Career Valuation)
 12. bio & careerClubs (Comprehensive biography + clubs played for)
"""

from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
JSON_PATH = ROOT_DIR / "frontend" / "src" / "data" / "madrid_analytics.json"

REF_DATE = date(2026, 10, 27)

POS_GROUP_VI = {
    "GK": "Thủ môn",
    "DEF": "Hậu vệ",
    "MID": "Tiền vệ",
    "FWD": "Tiền đạo",
}

POS_GROUP_EN = {
    "GK": "Goalkeeper",
    "DEF": "Defender",
    "MID": "Midfielder",
    "FWD": "Forward",
}

FOOT_MAP = {
    "R": {"vi": "Chân phải", "en": "Right foot"},
    "L": {"vi": "Chân trái", "en": "Left foot"},
    "B": {"vi": "Cả hai chân", "en": "Both feet"},
}

# Exact metadata for all 74 players:
# (fullName, height_m, weight_kg, foot_code, market_val, career_clubs, deceased_info)
PLAYER_12_METADATA: dict[str, tuple[str, str, str, str, str, str, str | None]] = {
    # --- 2026/27 SQUAD (32) ---
    "thibaut-courtois": (
        "Thibaut Nicolas Marc Courtois",
        "2,00 m",
        "96 kg",
        "L",
        "€35M",
        "Genk → Chelsea → Atlético Madrid (mượn) → Real Madrid CF",
        None,
    ),
    "andriy-lunin": (
        "Andriy Oleksiyovych Lunin",
        "1,91 m",
        "80 kg",
        "R",
        "€28M",
        "Dnipro → Zorya Luhansk → Real Madrid CF (mượn: Leganés, Real Valladolid, Real Oviedo) → Real Madrid CF",
        None,
    ),
    "sergio-mestre": (
        "Sergio Mestre Sánchez",
        "1,93 m",
        "82 kg",
        "R",
        "€3M",
        "Atlético Madrid B → Real Madrid Castilla → Real Madrid CF",
        None,
    ),
    "javier-navarro": (
        "Javier Navarro Jiménez",
        "1,90 m",
        "79 kg",
        "R",
        "€2M",
        "La Fábrica (Real Madrid Juvenil A) → Real Madrid Castilla → Real Madrid CF",
        None,
    ),
    "raul-asencio": (
        "Raúl Asencio del Rosario",
        "1,84 m",
        "78 kg",
        "R",
        "€40M",
        "UD Las Palmas Youth → Real Madrid Castilla → Real Madrid CF",
        None,
    ),
    "eder-militao": (
        "Éder Gabriel Militão",
        "1,86 m",
        "78 kg",
        "R",
        "€60M",
        "São Paulo FC → FC Porto → Real Madrid CF",
        None,
    ),
    "dean-huijsen": (
        "Dean Donny Huijsen Wijsmuller",
        "1,97 m",
        "87 kg",
        "B",
        "€75M",
        "Málaga Youth → Juventus → AS Roma (mượn) → AFC Bournemouth → Real Madrid CF",
        None,
    ),
    "trent-alexander-arnold": (
        "Trent John Alexander-Arnold",
        "1,80 m",
        "72 kg",
        "R",
        "€85M",
        "Liverpool FC (2016–2025) → Real Madrid CF",
        None,
    ),
    "ibrahima-konate": (
        "Ibrahima Konaté",
        "1,94 m",
        "95 kg",
        "R",
        "€70M",
        "FC Sochaux → RB Leipzig → Liverpool FC → Real Madrid CF",
        None,
    ),
    "marc-cucurella": (
        "Marc Cucurella Saseta",
        "1,73 m",
        "66 kg",
        "L",
        "€50M",
        "Espanyol Youth → FC Barcelona → Eibar → Getafe → Brighton → Chelsea → Real Madrid CF",
        None,
    ),
    "alvaro-carreras": (
        "Álvaro Fernández Carreras",
        "1,86 m",
        "78 kg",
        "L",
        "€55M",
        "Deportivo La Coruña Youth → Real Madrid La Fábrica → Manchester United → Preston / Granada → SL Benfica → Real Madrid CF",
        None,
    ),
    "antonio-rudiger": (
        "Antonio Rüdiger",
        "1,90 m",
        "85 kg",
        "R",
        "€25M",
        "VfB Stuttgart → AS Roma → Chelsea FC → Real Madrid CF",
        None,
    ),
    "ferland-mendy": (
        "Ferland Sinna Mendy",
        "1,80 m",
        "73 kg",
        "L",
        "€22M",
        "PSG Youth → Le Havre AC → Olympique Lyonnais → Real Madrid CF",
        None,
    ),
    "denzel-dumfries": (
        "Denzel Justus Morris Dumfries",
        "1,88 m",
        "80 kg",
        "R",
        "€38M",
        "Sparta Rotterdam → SC Heerenveen → PSV Eindhoven → Inter Milan → Real Madrid CF",
        None,
    ),
    "joan-martinez": (
        "Joan Martínez Lozano",
        "1,92 m",
        "81 kg",
        "R",
        "€25M",
        "Levante UD Youth → Real Madrid La Fábrica → Real Madrid CF",
        None,
    ),
    "jude-bellingham": (
        "Jude Victor William Bellingham",
        "1,86 m",
        "75 kg",
        "R",
        "€180M",
        "Birmingham City → Borussia Dortmund → Real Madrid CF",
        None,
    ),
    "eduardo-camavinga": (
        "Eduardo Celmi Camavinga",
        "1,82 m",
        "68 kg",
        "L",
        "€100M",
        "Stade Rennais FC → Real Madrid CF",
        None,
    ),
    "federico-valverde": (
        "Federico Santiago Valverde Dipetta",
        "1,82 m",
        "78 kg",
        "R",
        "€130M",
        "Peñarol → Real Madrid Castilla → Deportivo La Coruña (mượn) → Real Madrid CF",
        None,
    ),
    "aurelien-tchouameni": (
        "Aurélien Djani Tchouaméni",
        "1,88 m",
        "81 kg",
        "R",
        "€90M",
        "Girondins de Bordeaux → AS Monaco → Real Madrid CF",
        None,
    ),
    "arda-guler": (
        "Arda Güler",
        "1,75 m",
        "70 kg",
        "L",
        "€90M",
        "Gençlerbirliği Youth → Fenerbahçe SK → Real Madrid CF",
        None,
    ),
    "bernardo-silva": (
        "Bernardo Mota Veiga de Carvalho e Silva",
        "1,73 m",
        "64 kg",
        "L",
        "€55M",
        "SL Benfica → AS Monaco → Manchester City → Real Madrid CF",
        None,
    ),
    "thiago-pitarch": (
        "Thiago Pitarch Pinar",
        "1,79 m",
        "71 kg",
        "R",
        "€15M",
        "Atlético Madrid Youth → Leganés Youth → Real Madrid La Fábrica → Real Madrid CF",
        None,
    ),
    "jorge-cestero": (
        "Jorge Cestero",
        "1,81 m",
        "73 kg",
        "R",
        "€12M",
        "Real Zaragoza Youth → Real Madrid Castilla → Real Madrid CF",
        None,
    ),
    "sergio-martinez": (
        "Sergio Martínez",
        "1,78 m",
        "70 kg",
        "R",
        "€10M",
        "Real Madrid La Fábrica → Real Madrid Castilla → Real Madrid CF",
        None,
    ),
    "vinicius-junior": (
        "Vinícius José Paixão de Oliveira Júnior",
        "1,76 m",
        "73 kg",
        "R",
        "€200M",
        "CR Flamengo → Real Madrid Castilla → Real Madrid CF",
        None,
    ),
    "endrick": (
        "Endrick Felipe Moreira de Sousa",
        "1,73 m",
        "68 kg",
        "L",
        "€75M",
        "SE Palmeiras → Real Madrid CF",
        None,
    ),
    "kylian-mbappe": (
        "Kylian Mbappé Lottin",
        "1,78 m",
        "75 kg",
        "R",
        "€200M",
        "AS Bondy → INF Clairefontaine → AS Monaco → Paris Saint-Germain → Real Madrid CF",
        None,
    ),
    "rodrygo": (
        "Rodrygo Silva de Goes",
        "1,74 m",
        "64 kg",
        "R",
        "€110M",
        "Santos FC → Real Madrid CF",
        None,
    ),
    "carlos-espi": (
        "Carlos Espí Escrihuela",
        "1,94 m",
        "84 kg",
        "R",
        "€18M",
        "UD Alzira → Levante UD → Real Madrid Castilla → Real Madrid CF",
        None,
    ),
    "brahim-diaz": (
        "Brahim Abdelkader Díaz",
        "1,70 m",
        "68 kg",
        "B",
        "€45M",
        "Málaga Youth → Manchester City → Real Madrid CF → AC Milan (mượn) → Real Madrid CF",
        None,
    ),
    "yan-diomande": (
        "Yan Diomande",
        "1,80 m",
        "72 kg",
        "B",
        "€120M",
        "DME Academy → CD Leganés → RB Leipzig → Real Madrid CF (Hợp đồng 2026–2033)",
        None,
    ),
    "franco-mastantuono": (
        "Franco Mastantuono",
        "1,77 m",
        "71 kg",
        "L",
        "€65M",
        "CA River Plate → Real Madrid CF",
        None,
    ),
    # --- ALL-TIME LEGENDS (42) ---
    "alfredo-di-stefano": (
        "Alfredo Stéfano Di Stéfano Laulhé",
        "1,78 m",
        "76 kg",
        "B",
        "Huyền thoại Vô giá (2x Quả Bóng Vàng & Siêu QBV)",
        "River Plate → Huracán → Millonarios → Real Madrid CF (1953–1964) → Espanyol",
        "04/07/1926 – 07/07/2014 (Thọ 88 tuổi)",
    ),
    "ferenc-puskas": (
        "Ferenc Puskás Biró",
        "1,72 m",
        "72 kg",
        "L",
        "Huyền thoại Vô giá (4x Pichichi • 242 bàn/262 trận)",
        "Budapest Honvéd (1943–1956) → Real Madrid CF (1958–1966)",
        "01/04/1927 – 17/11/2006 (Thọ 79 tuổi)",
    ),
    "paco-gento": (
        "Francisco Gento López",
        "1,71 m",
        "69 kg",
        "L",
        "Huyền thoại Vô giá (Kỷ lục 6 Cúp C1 & 12 La Liga)",
        "Racing Santander → Real Madrid CF (1953–1971)",
        "21/10/1933 – 18/01/2022 (Thọ 88 tuổi)",
    ),
    "raymond-kopa": (
        "Raymond Kopaszewski (Kopa)",
        "1,68 m",
        "68 kg",
        "R",
        "Huyền thoại Vô giá (Quả Bóng Vàng 1958 • 3x C1)",
        "SCO Angers → Stade de Reims → Real Madrid CF (1956–1959) → Stade de Reims",
        "13/10/1931 – 03/03/2017 (Thọ 85 tuổi)",
    ),
    "santillana": (
        "Carlos Alonso González (Santillana)",
        "1,75 m",
        "74 kg",
        "R",
        "Huyền thoại Vô giá (290 bàn thắng / 645 trận)",
        "Racing Santander → Real Madrid CF (1971–1988)",
        None,
    ),
    "pirri": (
        "José Martínez Sánchez (Pirri)",
        "1,77 m",
        "74 kg",
        "R",
        "Huyền thoại Vô giá (Cúp C1 1966 & 10 La Liga)",
        "Granada CF → Real Madrid CF (1964–1980) → Puebla FC",
        None,
    ),
    "amancio-amaro": (
        "Amancio Amaro Varela",
        "1,75 m",
        "72 kg",
        "R",
        "Huyền thoại Vô giá (Cúp C1 1966 & 9 La Liga)",
        "Deportivo La Coruña → Real Madrid CF (1962–1976)",
        "16/10/1939 – 21/02/2023 (Thọ 83 tuổi)",
    ),
    "juanito": (
        "Juan Gómez González (Juanito)",
        "1,69 m",
        "67 kg",
        "R",
        "Huyền thoại Bất tử Số 7 (Biểu tượng Tinh thần Remontada)",
        "Atlético Madrid Youth → Burgos CF → Real Madrid CF (1977–1987) → Málaga",
        "10/11/1954 – 02/04/1992 (Hưởng dương 37 tuổi)",
    ),
    "emilio-butragueno": (
        "Emilio Butragueño Santos",
        "1,68 m",
        "68 kg",
        "R",
        "Huyền thoại La Quinta del Buitre (6 La Liga)",
        "Real Madrid Castilla → Real Madrid CF (1984–1995) → Atlético Celaya",
        None,
    ),
    "hugo-sanchez": (
        "Hugo Sánchez Márquez",
        "1,75 m",
        "73 kg",
        "L",
        "Huyền thoại Chiếc Giày Vàng Châu Âu (208 bàn/282 trận)",
        "UNAM Pumas → Atlético Madrid → Real Madrid CF (1985–1992) → Club América → Rayo Vallecano",
        None,
    ),
    "manolo-sanchis": (
        "Manuel Sanchís Hontiyuelo",
        "1,77 m",
        "75 kg",
        "R",
        "Huyền thoại One-Club Man (710 trận • 2 C1 & 8 La Liga)",
        "Real Madrid La Fábrica → Real Madrid Castilla → Real Madrid CF (1983–2001)",
        None,
    ),
    "fernando-hierro": (
        "Fernando Ruiz Hierro",
        "1,87 m",
        "84 kg",
        "R",
        "Huyền thoại Đội trưởng (127 bàn thắng • 3x C1)",
        "Real Valladolid → Real Madrid CF (1989–2003) → Al-Rayyan → Bolton Wanderers",
        None,
    ),
    "fernando-redondo": (
        "Fernando Carlos Redondo Neri",
        "1,86 m",
        "80 kg",
        "L",
        "Huyền thoại Hoàng tử Tango (Cầu thủ xuất sắc nhất C1 2000)",
        "Argentinos Juniors → CD Tenerife → Real Madrid CF (1994–2000) → AC Milan",
        None,
    ),
    "roberto-carlos": (
        "Roberto Carlos da Silva Rocha",
        "1,68 m",
        "70 kg",
        "L",
        "€50M (Đỉnh cao sự nghiệp • 527 trận • 3x C1)",
        "União São João → Palmeiras → Inter Milan → Real Madrid CF (1996–2007) → Fenerbahçe",
        None,
    ),
    "raul-gonzalez": (
        "Raúl González Blanco",
        "1,80 m",
        "68 kg",
        "L",
        "€65M (Đỉnh cao sự nghiệp • 741 trận • 323 bàn thắng)",
        "Real Madrid La Fábrica → Real Madrid CF (1994–2010) → Schalke 04 → Al-Sadd → NY Cosmos",
        None,
    ),
    "iker-casillas": (
        "Iker Casillas Fernández",
        "1,82 m",
        "84 kg",
        "L",
        "€40M (Đỉnh cao sự nghiệp • 725 trận • 5x Thủ môn hay nhất TG)",
        "Real Madrid La Fábrica → Real Madrid CF (1999–2015) → FC Porto",
        None,
    ),
    "zinedine-zidane": (
        "Zinedine Yazid Zidane",
        "1,85 m",
        "80 kg",
        "B",
        "€77.5M (Kỷ lục TG 2001 • Quả Bóng Vàng & HLV Ăn 3 C1)",
        "AS Cannes → Girondins de Bordeaux → Juventus → Real Madrid CF (2001–2006 & HLV 2016–2021)",
        None,
    ),
    "ronaldo-nazario": (
        "Ronaldo Luís Nazário de Lima",
        "1,83 m",
        "82 kg",
        "B",
        "€60M (Đỉnh cao sự nghiệp • 2x Quả Bóng Vàng)",
        "Cruzeiro → PSV Eindhoven → FC Barcelona → Inter Milan → Real Madrid CF (2002–2007) → AC Milan → Corinthians",
        None,
    ),
    "luis-figo": (
        "Luís Filipe Madeira Caeiro Figo",
        "1,80 m",
        "75 kg",
        "R",
        "€62M (Kỷ lục TG 2000 • Quả Bóng Vàng 2000)",
        "Sporting CP → FC Barcelona → Real Madrid CF (2000–2005) → Inter Milan",
        None,
    ),
    "david-beckham": (
        "David Robert Joseph Beckham",
        "1,83 m",
        "75 kg",
        "R",
        "€45M (Đỉnh cao sự nghiệp • Galácticos #23)",
        "Manchester United → Preston (mượn) → Real Madrid CF (2003–2007) → LA Galaxy → AC Milan → PSG",
        None,
    ),
    "guti": (
        "José María Gutiérrez Hernández (Guti)",
        "1,83 m",
        "77 kg",
        "L",
        "€30M (Đỉnh cao sự nghiệp • 542 trận • 3x C1)",
        "Real Madrid La Fábrica → Real Madrid CF (1995–2010) → Beşiktaş JK",
        None,
    ),
    "claude-makelele": (
        "Claude Makélélé Sinda",
        "1,74 m",
        "70 kg",
        "R",
        "€35M (Đỉnh cao sự nghiệp • Mỏ neo định danh vị trí Makelele Role)",
        "FC Nantes → Olympique Marseille → Celta Vigo → Real Madrid CF (2000–2003) → Chelsea → PSG",
        None,
    ),
    "cristiano-ronaldo": (
        "Cristiano Ronaldo dos Santos Aveiro",
        "1,87 m",
        "85 kg",
        "B",
        "€120M (Đỉnh cao sự nghiệp • 450 bàn/438 trận • 4x C1 tại RM)",
        "Sporting CP → Manchester United → Real Madrid CF (2009–2018) → Juventus → Manchester United → Al-Nassr",
        None,
    ),
    "karim-benzema": (
        "Karim Mostafa Benzema",
        "1,85 m",
        "81 kg",
        "R",
        "€60M (Đỉnh cao sự nghiệp • Quả Bóng Vàng 2022 • 354 bàn/648 trận)",
        "Olympique Lyonnais → Real Madrid CF (2009–2023) → Al-Ittihad",
        None,
    ),
    "sergio-ramos": (
        "Sergio Ramos García",
        "1,84 m",
        "82 kg",
        "R",
        "€50M (Đỉnh cao sự nghiệp • 671 trận • 101 bàn thắng • 4x C1)",
        "Sevilla FC → Real Madrid CF (2005–2021) → Paris Saint-Germain → Sevilla FC",
        None,
    ),
    "luka-modric": (
        "Luka Modrić",
        "1,72 m",
        "66 kg",
        "B",
        "€55M (Đỉnh cao sự nghiệp • Quả Bóng Vàng 2018 • 28 danh hiệu)",
        "Dinamo Zagreb → Zrinjski / Inter Zaprešić (mượn) → Tottenham Hotspur → Real Madrid CF (2012–2025)",
        None,
    ),
    "toni-kroos": (
        "Toni Kroos",
        "1,83 m",
        "78 kg",
        "R",
        "€80M (Đỉnh cao sự nghiệp • 6x Champions League • 465 trận)",
        "Bayern Munich → Bayer Leverkusen (mượn) → Bayern Munich → Real Madrid CF (2014–2024)",
        None,
    ),
    "marcelo": (
        "Marcelo Vieira da Silva Júnior",
        "1,74 m",
        "75 kg",
        "L",
        "€70M (Đỉnh cao sự nghiệp • 546 trận • 25 danh hiệu)",
        "Fluminense FC → Real Madrid CF (2007–2022) → Olympiacos → Fluminense FC",
        None,
    ),
    "gareth-bale": (
        "Gareth Frank Bale",
        "1,85 m",
        "81 kg",
        "L",
        "€101M (Kỷ lục TG 2013 • 106 bàn thắng • 5x Champions League)",
        "Southampton → Tottenham Hotspur → Real Madrid CF (2013–2022) → Los Angeles FC",
        None,
    ),
    "pepe": (
        "Képler Laveran Lima Ferreira (Pepe)",
        "1,87 m",
        "81 kg",
        "R",
        "€30M (Đỉnh cao sự nghiệp • 334 trận • 3x Champions League)",
        "Marítimo → FC Porto → Real Madrid CF (2007–2017) → Beşiktaş → FC Porto",
        None,
    ),
    "casemiro": (
        "Carlos Henrique Casimiro",
        "1,85 m",
        "84 kg",
        "R",
        "€80M (Đỉnh cao sự nghiệp • 336 trận • 5x Champions League)",
        "São Paulo FC → Real Madrid Castilla → FC Porto (mượn) → Real Madrid CF (2013–2022) → Manchester United",
        None,
    ),
    "keylor-navas": (
        "Keylor Antonio Navas Gamboa",
        "1,85 m",
        "80 kg",
        "R",
        "€20M (Đỉnh cao sự nghiệp • Thủ môn chính Ăn 3 C1 liên tiếp)",
        "Deportivo Saprissa → Albacete → Levante UD → Real Madrid CF (2014–2019) → Paris Saint-Germain",
        None,
    ),
    "angel-di-maria": (
        "Ángel Fabián Di María",
        "1,78 m",
        "75 kg",
        "L",
        "€75M (Đỉnh cao sự nghiệp • MVP Chung kết La Décima 2014)",
        "Rosario Central → SL Benfica → Real Madrid CF (2010–2014) → Man United → PSG → Juventus → Benfica",
        None,
    ),
    "mesut-ozil": (
        "Mesut Özil",
        "1,80 m",
        "76 kg",
        "L",
        "€50M (Đỉnh cao sự nghiệp • 81 kiến tạo / 159 trận tại RM)",
        "Schalke 04 → Werder Bremen → Real Madrid CF (2010–2013) → Arsenal → Fenerbahçe → Başakşehir",
        None,
    ),
    "xabi-alonso": (
        "Xabier Alonso Olano",
        "1,83 m",
        "77 kg",
        "R",
        "€40M (Đỉnh cao sự nghiệp • Nhạc trưởng La Décima 2014)",
        "Real Sociedad → Eibar (mượn) → Liverpool FC → Real Madrid CF (2009–2014) → Bayern Munich",
        None,
    ),
    "isco": (
        "Francisco Román Alarcón Suárez (Isco)",
        "1,76 m",
        "74 kg",
        "R",
        "€90M (Đỉnh cao sự nghiệp • 353 trận • 5x Champions League)",
        "Valencia CF → Málaga CF → Real Madrid CF (2013–2022) → Sevilla FC → Real Betis",
        None,
    ),
    "raphael-varane": (
        "Raphaël Xavier Varane",
        "1,91 m",
        "81 kg",
        "R",
        "€80M (Đỉnh cao sự nghiệp • 360 trận • 4x Champions League)",
        "RC Lens → Real Madrid CF (2011–2021) → Manchester United → Como 1907",
        None,
    ),
    "dani-carvajal": (
        "Daniel Carvajal Ramos",
        "1,73 m",
        "73 kg",
        "R",
        "€60M (Đỉnh cao sự nghiệp • 6x Champions League • 27 danh hiệu)",
        "Real Madrid Castilla → Bayer Leverkusen → Real Madrid CF (2013–2026)",
        None,
    ),
    "marco-asensio": (
        "Marco Asensio Willemsen",
        "1,82 m",
        "76 kg",
        "L",
        "€90M (Đỉnh cao sự nghiệp • 286 trận • 3x Champions League)",
        "RCD Mallorca → Espanyol (mượn) → Real Madrid CF (2016–2023) → Paris Saint-Germain",
        None,
    ),
    "lucas-vazquez": (
        "Lucas Vázquez Iglesias",
        "1,73 m",
        "70 kg",
        "R",
        "€25M (Đỉnh cao sự nghiệp • 362 trận • 5x Champions League)",
        "Real Madrid Castilla → Espanyol (mượn) → Real Madrid CF (2015–2025)",
        None,
    ),
    "nacho-fernandez": (
        "José Ignacio Fernández Iglesias (Nacho)",
        "1,80 m",
        "76 kg",
        "R",
        "€15M (Đỉnh cao sự nghiệp • 364 trận • 6x Champions League)",
        "Real Madrid La Fábrica → Real Madrid Castilla → Real Madrid CF (2011–2024) → Al-Qadsiah",
        None,
    ),
    "mateo-kovacic": (
        "Mateo Kovačić",
        "1,77 m",
        "81 kg",
        "R",
        "€45M (Đỉnh cao sự nghiệp • 3x Champions League 2016–2018)",
        "Dinamo Zagreb → Inter Milan → Real Madrid CF (2015–2018) → Chelsea → Manchester City",
        None,
    ),
}


def compute_age_display(bdate_str: str, deceased_info: str | None) -> dict[str, str]:
    if deceased_info:
        en_info = (
            deceased_info.replace("Thọ", "Aged")
            .replace("Hưởng dương", "Aged")
            .replace("tuổi", "years")
        )
        return {"vi": deceased_info, "en": en_info}

    parts = bdate_str.split("/")
    if len(parts) == 3:
        d, m, y = int(parts[0]), int(parts[1]), int(parts[2])
        born = date(y, m, d)
        age = REF_DATE.year - born.year - ((REF_DATE.month, REF_DATE.day) < (born.month, born.day))
        return {
            "vi": f"{bdate_str} — {age} tuổi",
            "en": f"{bdate_str} — {age} years old",
        }
    return {"vi": bdate_str, "en": bdate_str}


def main() -> None:
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated = 0
    for player in data["players"]:
        pid = player["id"]
        meta = PLAYER_12_METADATA.get(pid)
        if not meta:
            print(f"WARNING: Missing metadata for {pid}")
            continue

        full_name, height_m, weight_kg, foot_code, market_val, career_clubs, deceased_info = meta
        pos_group = player["positionGroup"]
        spec_pos_str = " / ".join(player["specificPositions"])

        player["fullName"] = full_name
        player["birthDateAndAge"] = compute_age_display(player["birthDate"], deceased_info)
        player["clubName"] = (
            {"vi": "Real Madrid CF", "en": "Real Madrid CF"}
            if player["category"] == "squad_2026_27"
            else {
                "vi": f"Real Madrid CF (Huyền thoại • {player['era']})",
                "en": f"Real Madrid CF (Legend • {player['era']})",
            }
        )
        player["positionFull"] = {
            "vi": f"{POS_GROUP_VI.get(pos_group, pos_group)} ({spec_pos_str})",
            "en": f"{POS_GROUP_EN.get(pos_group, pos_group)} ({spec_pos_str})",
        }
        player["height"] = height_m
        player["weight"] = weight_kg
        player["preferredFoot"] = FOOT_MAP[foot_code]
        player["marketValue"] = market_val
        player["careerClubs"] = career_clubs

        # Ensure bio includes career clubs if not already present
        base_bio_vi = player["bio"]["vi"].split(" • Hành trình CLB:")[0]
        base_bio_en = player["bio"]["en"].split(" • Career Clubs:")[0]
        player["bio"]["vi"] = f"{base_bio_vi} • Hành trình CLB: {career_clubs}."
        player["bio"]["en"] = f"{base_bio_en} • Career Clubs: {career_clubs}."
        updated += 1

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Successfully enriched {updated}/{len(data['players'])} players with all 12 standard profile fields!")


if __name__ == "__main__":
    main()
