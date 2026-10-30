-- =============================================================================
-- HALAMADRID VN — ALL-TIME REAL MADRID ENCYCLOPEDIA & DATA ANALYSIS (1902–2026)
-- Relational Database Schema (PostgreSQL / SQLite Compatible)
-- =============================================================================

DROP TABLE IF EXISTS el_clasico_matches CASCADE;
DROP TABLE IF EXISTS ucl_finals CASCADE;
DROP TABLE IF EXISTS club_leaders CASCADE;
DROP TABLE IF EXISTS historical_eras CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- 1. BẢNG CẦU THỦ & HUYỀN THOẠI (1902–2026/27)
CREATE TABLE players (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    shirt_number INT NOT NULL,
    category VARCHAR(32) NOT NULL CHECK (category IN ('squad_2026_27', 'legend')),
    position_group VARCHAR(16) NOT NULL CHECK (position_group IN ('GK', 'DEF', 'MID', 'FWD')),
    specific_positions VARCHAR(64) NOT NULL,
    nationality_vi VARCHAR(64) NOT NULL,
    nationality_en VARCHAR(64) NOT NULL,
    flag_emoji VARCHAR(16) NOT NULL,
    birth_date VARCHAR(32) NOT NULL,
    era_years VARCHAR(32) NOT NULL,
    market_value VARCHAR(32) NOT NULL,
    contract_until VARCHAR(16),
    appearances INT NOT NULL DEFAULT 0,
    goals INT NOT NULL DEFAULT 0,
    assists INT NOT NULL DEFAULT 0,
    trophies INT NOT NULL DEFAULT 0,
    minutes_played INT NOT NULL DEFAULT 0,
    top_speed_kmh DECIMAL(4,1) NOT NULL DEFAULT 32.0,
    goals_per_90 DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    assists_per_90 DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    ga_per_90 DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    era_z_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    radar_scoring INT NOT NULL CHECK (radar_scoring BETWEEN 0 AND 99),
    radar_creativity INT NOT NULL CHECK (radar_creativity BETWEEN 0 AND 99),
    radar_progression INT NOT NULL CHECK (radar_progression BETWEEN 0 AND 99),
    radar_pace_physical INT NOT NULL CHECK (radar_pace_physical BETWEEN 0 AND 99),
    radar_defensive INT NOT NULL CHECK (radar_defensive BETWEEN 0 AND 99),
    radar_big_game INT NOT NULL CHECK (radar_big_game BETWEEN 0 AND 99),
    image_url VARCHAR(255) NOT NULL,
    bio_vi TEXT NOT NULL,
    bio_en TEXT NOT NULL
);

-- 2. BẢNG CHỦ TỊCH & HUẤN LUYỆN VIÊN VĨ ĐẠI
CREATE TABLE club_leaders (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    role_type VARCHAR(32) NOT NULL CHECK (role_type IN ('President', 'Manager', 'Player & Manager')),
    tenure_years VARCHAR(64) NOT NULL,
    major_trophies INT NOT NULL,
    win_rate_pct DECIMAL(5,2),
    image_url VARCHAR(255) NOT NULL,
    legacy_vi TEXT NOT NULL,
    legacy_en TEXT NOT NULL
);

-- 3. BẢNG 15+ CHỨC VÔ ĐỊCH CÚP C1 / UEFA CHAMPIONS LEAGUE (1956–2026)
CREATE TABLE ucl_finals (
    edition INT PRIMARY KEY,
    season_year INT NOT NULL,
    title_badge VARCHAR(64) NOT NULL,
    opponent VARCHAR(120) NOT NULL,
    final_score VARCHAR(32) NOT NULL,
    venue_city VARCHAR(120) NOT NULL,
    head_coach VARCHAR(120) NOT NULL,
    final_mvp VARCHAR(120) NOT NULL,
    scorers TEXT NOT NULL,
    narrative_vi TEXT NOT NULL,
    narrative_en TEXT NOT NULL
);

-- 4. BẢNG LỊCH SỬ ĐẠI CHIẾN EL CLÁSICO TIÊU BIỂU (CẬP NHẬT TỚI 26/10/2026)
CREATE TABLE el_clasico_matches (
    match_id VARCHAR(64) PRIMARY KEY,
    match_date DATE NOT NULL,
    competition VARCHAR(64) NOT NULL,
    venue VARCHAR(120) NOT NULL,
    home_team VARCHAR(64) NOT NULL,
    away_team VARCHAR(64) NOT NULL,
    real_madrid_goals INT NOT NULL,
    barcelona_goals INT NOT NULL,
    key_scorers TEXT NOT NULL,
    highlight_vi TEXT NOT NULL,
    highlight_en TEXT NOT NULL
);

-- 5. BẢNG 7 KỶ NGUYÊN LỊCH SỬ (1902–2026)
CREATE TABLE historical_eras (
    era_id VARCHAR(64) PRIMARY KEY,
    period_range VARCHAR(32) NOT NULL,
    title_vi VARCHAR(160) NOT NULL,
    title_en VARCHAR(160) NOT NULL,
    bernabeu_capacity INT NOT NULL,
    trophies_won INT NOT NULL,
    key_icons VARCHAR(255) NOT NULL,
    summary_vi TEXT NOT NULL,
    summary_en TEXT NOT NULL
);

CREATE INDEX idx_players_category ON players(category);
CREATE INDEX idx_players_position ON players(position_group);
CREATE INDEX idx_players_shirt ON players(shirt_number);
