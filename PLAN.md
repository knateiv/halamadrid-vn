# KẾ HOẠCH & TIẾN ĐỘ DỰ ÁN (MULTI-AGENT 4 BƯỚC — PHIÊN BẢN V5.0 ROYAL MOTION DESIGN SYSTEM)

## Trạng thái hiện tại
- **Giai đoạn đang thực hiện**: Hoàn tất 100% Bản nâng cấp **V5.0 Royal Motion Design System & 12-Field Portal Profile Modal** (Đồng bộ hệ thống Motion Tokens `--ease-out-expo`, `--ease-in-out-quart`, `--ease-spring-subtle`, chuyển động lướt 11 cầu thủ trên sa bàn 2D khi đổi Cúp C1 / sơ đồ, hiệu ứng nở đa giác Radar 6 trục & 6 thanh chỉ số trong Modal Portal 2 cột 12 mục hồ sơ, hỗ trợ `prefers-reduced-motion` — `0 errors`)
- **Cập nhật lần cuối**: 2026-10-27 12:40

## Tiến độ chi tiết 4 Agent (V3.0 Upgrade)

### 1. Agent 1 — Real Madrid Kit Image Scraper Agent (`fetch_official_madrid_data.py`)
- [x] Tìm kiếm chuyên biệt trên Wikimedia Commons API (`<Tên_Cầu_Thủ> "Real Madrid" filetype:bitmap`) ưu tiên ảnh mặc áo thi đấu Real Madrid và lọc bỏ ảnh đội tuyển quốc gia / CLB khác.
- [x] Ghép cổ áo & huy hiệu Real Madrid Royal White & Gold cho các tân binh mùa 2026/27 (`#25 Yan Diomande`, `#12 Alexander-Arnold`, `#4 Dean Huijsen`...) đảm bảo **100% (73/73) bức ảnh** đều khoác sắc áo Hoàng gia Real Madrid.

### 2. Agent 2 — Walkout & Signature Celebration Animation Agent (`PlayerWalkoutModal.tsx`)
- [x] **Giai đoạn 1 — Walkout Bước Ra Khoanh Tay (0.8s đầu tiên)**:
  - Hiệu ứng Đèn pha Sân vận động Bernabéu (`Stadium Spotlight Sweep`) + mưa hạt bụi vàng (`Golden Confetti & Sparks Canvas`).
  - Hiệu ứng chiều sâu 3D (`@keyframes walkoutEnter`) và huy hiệu **Tư thế Khoanh tay bước ra sân chuẩn UEFA Champions League**.
- [x] **Giai đoạn 2 — Hiệu ứng Ăn mừng Đặc trưng riêng của từng Cầu thủ (`Signature Celebration Trigger`)**:
  - Tự động kích hoạt sau 0.8s kèm nút **"🔥 Tái Hiện Pha Ăn Mừng Đặc Trưng"** và âm thanh sân vận động Web Audio API cho:
    + **Cristiano Ronaldo**: Bật nhảy xoay người **"¡SIUUUUUUU!"** & `450 BÀN THẮNG / 438 TRẬN`.
    + **Kylian Mbappé**: **"TRADEMARK CROSSED ARMS ⚡"** kèm tia chớp tốc độ `36.4 KM/H`.
    + **Jude Bellingham**: Dang rộng hai cánh tay **"BELLIGOL • HEY JUDE!"**.
    + **Vinícius Júnior**: Vũ điệu Samba & hôn logo **"¡BAILA VINI JR.!"**.
    + **Yan Diomande (`#25`)**: Bứt tốc xé gió cánh phải **"IVORIAN LIGHTNING • 36.3 KM/H"** (`€120M • G+A/90 = 0.66`).
    + **Sergio Ramos**: **"92:48 • ¡LA DÉCIMA!"** & chỉ tay lên bầu trời.
    + **Raúl González**: Động tác hôn nhẫn **"¡EL SIETE DE ESPAÑA!"**.
    + **Zinedine Zidane**: Cú bắt vô-lê chân trái **"LA NOVENA VOLLEY!"** Glasgow 2002.
    + **Toni Kroos & Luka Modrić**: Nhịp đập nhạc trưởng **"MAESTRO METRONOME!"**.

### 3. Agent 3 — Unified Typography, Light/Dark Mode & Visual FX Agent
- [x] **Đồng bộ 1 Font chữ duy nhất (`'Montserrat'`)**: Nhúng trong `index.html` và áp dụng xuyên suốt 100% phần tử (tiêu đề, đoạn văn, số liệu, nút bấm, biểu đồ SVG) trong `index.css` & `tailwind.config.js`.
- [x] **Nút chuyển đổi Chế độ Sáng / Tối (`☀️ Sáng (Bernabéu White)` / `🌙 Tối (Champions Night)`)**: Lưu trạng thái vào `localStorage` và đồng bộ `<meta name="color-scheme">`.
- [x] **Hiệu ứng thị giác cao cấp**:
  - `TiltCard.tsx`: 3D Holographic Card Tilt kèm vệt sáng Foil Glare.
  - `AnimatedCounter.tsx`: Hiệu ứng đếm số mượt mà khi cuộn tới.
  - `Interactive Pitch Glow`: Vùng nhiệt và đường chuyền phát sáng động trên sa bàn 2D.

### 4. Agent 4 — QA & Build Verification Agent
- [x] Kiểm định 74/74 hồ sơ ảnh (`qa_audit_assets.py`) hợp lệ 100%.
- [x] Chạy `npm run build` (`tsc --noEmit && vite build`) đạt **`0 errors`** (`built in 1.86s`).
- [x] Duy trì dev server tại `http://localhost:5173/` để nghiệm thu.
