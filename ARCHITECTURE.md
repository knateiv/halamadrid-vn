# KIẾN TRÚC HỆ THỐNG — HALAMADRID VN (1902–2026)

## 1. Sơ Đồ Kiến Trúc Tổng Thể (Polyglot Data & Web Architecture)

```mermaid
flowchart TD
    subgraph DataLayer["Tầng 1: Data Engineering & Official Scraper (Agent 1)"]
        SQL["schema.sql & seed_real_madrid_1902_2026.sql"]
        Scraper["fetch_official_madrid_data.py"]
        WikiAPI["Wikipedia REST API / Wikidata / Transfermarkt"]
        WikiAPI --> Scraper
        Scraper --> Images["frontend/public/images/players/*.jpg"]
    end

    subgraph QuantLayer["Tầng 2: Quantitative Sports Science (Agent 2)"]
        QuantPy["real_madrid_analytics.py (Pandas, NumPy, SciPy)"]
        Per90["Per-90 & Z-Score Era Normalization"]
        Radar6["6-Axis Percentile Ranks (Yan Diomande #25, Mbappé #10, CR7...)"]
        MonteCarlo["Bivariate Poisson & 10,000-Run Monte Carlo Era Simulator"]
        Remontada["15-Min Goal Distribution & DNA Remontada (76'-90+')"]
        SQL --> QuantPy
        QuantPy --> Per90 & Radar6 & MonteCarlo & Remontada
        Per90 & Radar6 & MonteCarlo & Remontada --> JSONData["frontend/src/data/madrid_analytics.json"]
    end

    subgraph UILayer["Tầng 3: Royal UI/UX & Tactical Canvas (Agent 3)"]
        ReactApp["React 18 + TypeScript + Vite + TailwindCSS"]
        M1["1. All-Time Timeline (1902–2026 & Bernabéu Evolution)"]
        M2["2. Virtual Trophy Museum (15+ UCL & 2D Final Lineups)"]
        M3["3. Legends & 2026/27 Squad Data Lab (Radar & Scatter Plot)"]
        M4["4. El Clásico (incl. 26/10/2026 2-1 Win) & Remontada DNA"]
        M5["5. All-Time XI Tactical Board & Live Monte Carlo Simulator"]
        M6["6. Madridista 101 (Culture, Presidents, Managers, Anthem)"]
        Images --> ReactApp
        JSONData --> ReactApp
        ReactApp --> M1 & M2 & M3 & M4 & M5 & M6
    end
```

## 2. Cấu Trúc Thư Mục Chuẩn

```text
D:\halamadrid-vn\
├── .agents\
│   ├── architect.md
│   ├── coder.md
│   ├── reviewer.md
│   └── tester.md
├── data-analysis\
│   ├── models\
│   │   └── schemas.py
│   ├── schema.sql
│   ├── seed_real_madrid_1902_2026.sql
│   ├── fetch_official_madrid_data.py
│   └── real_madrid_analytics.py
├── frontend\
│   ├── public\
│   │   └── images\
│   │       └── players\           # Toàn bộ ảnh chân dung thật của Cầu thủ, Huyền thoại, Chủ tịch, HLV
│   ├── src\
│   │   ├── components\            # 6 Phân hệ tương tác + Navbar + Footer + PlayerModal
│   │   ├── data\
│   │   │   └── madrid_analytics.json
│   │   ├── types\
│   │   │   └── database.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json
├── PLAN.md
├── CONTEXT.md
├── ARCHITECTURE.md
├── API_CONTRACT.md
└── .gitignore
```
