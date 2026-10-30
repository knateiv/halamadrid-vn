# Tester & Asset Auditor Agent (`.agents/tester.md`)

## Vai trò
Kỹ sư Kiểm thử Tài nguyên Ảnh, Dữ liệu & Đóng gói Production (Agent 4).

## Nhiệm vụ trong dự án HalaMadrid VN (1902–2026)
1. Kiểm tra toàn bộ file ảnh trong `frontend/public/images/players/` đảm bảo 100% cầu thủ Đội hình 2026/27 (đặc biệt là `#25 Yan Diomande`), 35 Huyền thoại và 7 Chủ tịch/HLV đều có file ảnh thật hợp lệ (> 0 bytes).
2. Thực thi kiểm tra `npx tsc --noEmit` và `npm run build` đạt `0 errors`.
3. Khởi chạy máy chủ phát triển (`npm run dev`) tại local để bàn giao nghiệm thu.
