# HỢP ĐỒNG DỮ LIỆU & GIAO TIẾP LIÊN TẦNG (API & DATA CONTRACT)

Tài liệu này định nghĩa cấu trúc dữ liệu chuẩn trao đổi giữa **Tầng Python Quantitative Analytics (Agent 1 & Agent 2)** và **Tầng React TypeScript Frontend (Agent 3 & Agent 4)** thông qua tệp `frontend/src/data/madrid_analytics.json` và thư mục tài nguyên `frontend/public/images/players/`.

## 1. Cấu Trúc `PlayerProfile` (Huyền thoại & Đội hình 2026/27)
- `id`: `string` (slug định danh duy nhất, ví dụ: `"yan-diomande"`, `"kylian-mbappe"`, `"cristiano-ronaldo"`)
- `name`: `string`
- `shirtNumber`: `number` (Số áo chuẩn `realmadrid.com` mùa 2026/27 hoặc số áo biểu tượng của Huyền thoại)
- `category`: `"squad_2026_27" | "legend"`
- `positionGroup`: `"GK" | "DEF" | "MID" | "FWD"`
- `specificPositions`: `string[]` (ví dụ: `["RW", "AM"]`)
- `nationality`: `{ vi: string; en: string; flag: string }`
- `birthDate`: `string` (ví dụ: `"14/11/2006"` cho `#25 Yan Diomande`)
- `era`: `string` (ví dụ: `"2026–2033"`, `"2009–2018"`)
- `marketValue`: `string` (ví dụ: `"€120M"`)
- `contractUntil`: `string | null` (ví dụ: `"2033"`)
- `imageUrl`: `string` (Đường dẫn cục bộ `/images/players/<id>.jpg`)
- `stats`:
  - `appearances`: `number`
  - `goals`: `number`
  - `assists`: `number`
  - `trophies`: `number`
  - `minutesPlayed`: `number`
  - `topSpeedKmh`: `number` (ví dụ: `36.3` cho `#25 Yan Diomande`)
  - `goalsPer90`: `number`
  - `assistsPer90`: `number`
  - `gaPer90`: `number` (ví dụ: `0.66` cho `#25 Yan Diomande`)
  - `eraZScore`: `number` (Điểm chuẩn hóa xuyên thời đại)
- `radarPercentiles`: (6 trục từ `0` đến `99`)
  - `scoring`: `number` (Khả năng ghi bàn / Phản xạ GK)
  - `creativity`: `number` (Kiến tạo & Sáng tạo / Phân phối bóng)
  - `progression`: `number` (Tịnh tiến bóng & Qua người)
  - `paceAndPhysical`: `number` (Tốc độ bứt tốc & Thể chất)
  - `defensiveWork`: `number` (Tranh chấp & Phòng ngự)
  - `bigGameImpact`: `number` (Bản lĩnh trận lớn & DNA C1)
- `bio`: `{ vi: string; en: string }`
- `highlights`: `{ vi: string[]; en: string[] }`

## 2. Cấu Trúc `ChampionsLeagueTitle` (15+ Cúp C1)
- `edition`: `number` (1 đến 15)
- `year`: `number`
- `titleName`: `string` (ví dụ: `"La Décima"`, `"La Decimoquinta"`)
- `opponent`: `string`
- `score`: `string`
- `venue`: `{ vi: string; en: string }`
- `coach`: `string`
- `mvp`: `string`
- `scorers`: `string[]`
- `story`: `{ vi: string; en: string }`
- `lineup`: Danh sách 11 cầu thủ đá chính kèm tọa độ `(x, y)` trên sa bàn 2D.

## 3. Cấu Trúc `MonteCarloEraTeam` & `RemontadaAnalytics`
- Thông số sức mạnh công/thủ (`lambdaAttack`, `lambdaDefense`, `eraRating`, `remontadaFactor`) phục vụ mô hình xác suất **Bivariate Poisson** và giả lập **10.000 trận đấu Monte Carlo** giữa 4 thế hệ hoàng kim (`1960`, `2002`, `2017`, `2026/27`).
- Phân phối bàn thắng theo 6 khung 15 phút (`1'-15'`, `16'-30'`, `31'-45+'`, `46'-60'`, `61'-75'`, `76'-90+'`) chứng minh toán học cho **DNA Remontada** của Real Madrid.
