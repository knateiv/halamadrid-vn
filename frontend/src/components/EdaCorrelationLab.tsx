import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Eye,
  LayoutGrid,
  Sparkles,
  Table2,
  TrendingUp,
} from 'lucide-react';
import { Language, PlayerProfile } from '../types/database';
import { PlayerAvatar } from './PlayerAvatar';
import { CountryFlag } from './CountryFlag';

export type MetricKey =
  | 'appearances'
  | 'goals'
  | 'assists'
  | 'gaPer90'
  | 'topSpeedKmh'
  | 'eraZScore'
  | 'marketValueMillions';

export type MatrixSortKey =
  | 'name'
  | 'appearances'
  | 'goals'
  | 'assists'
  | 'gaPer90'
  | 'xG'
  | 'deltaXG'
  | 'topSpeedKmh'
  | 'eraZScore'
  | 'percentileRank';

interface MetricDefinition {
  key: MetricKey;
  labelVi: string;
  labelEn: string;
  unit: string;
  decimals: number;
}

const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: 'topSpeedKmh',
    labelVi: 'Tốc độ tối đa (km/h)',
    labelEn: 'Peak Sprint Speed (km/h)',
    unit: 'km/h',
    decimals: 1,
  },
  {
    key: 'gaPer90',
    labelVi: 'Hiệu suất G+A/90',
    labelEn: 'G+A per 90 Mins',
    unit: '/90',
    decimals: 2,
  },
  {
    key: 'appearances',
    labelVi: 'Số trận ra sân',
    labelEn: 'Appearances',
    unit: 'trận',
    decimals: 0,
  },
  {
    key: 'goals',
    labelVi: 'Bàn thắng',
    labelEn: 'Goals Scored',
    unit: 'bàn',
    decimals: 0,
  },
  {
    key: 'assists',
    labelVi: 'Kiến tạo',
    labelEn: 'Assists',
    unit: 'KT',
    decimals: 0,
  },
  {
    key: 'eraZScore',
    labelVi: 'Điểm chuẩn hóa (Z)',
    labelEn: 'Normalized Era Z-Score',
    unit: 'σ',
    decimals: 2,
  },
  {
    key: 'marketValueMillions',
    labelVi: 'Giá trị thị trường (€M)',
    labelEn: 'Market Valuation (€M)',
    unit: '€M',
    decimals: 0,
  },
];

export function extractPlayerMetric(player: PlayerProfile, key: MetricKey): number {
  switch (key) {
    case 'appearances':
      return player.stats.appearances;
    case 'goals':
      return player.stats.goals;
    case 'assists':
      return player.stats.assists;
    case 'gaPer90':
      return player.stats.gaPer90;
    case 'topSpeedKmh':
      return player.stats.topSpeedKmh;
    case 'eraZScore':
      return player.stats.eraZScore;
    case 'marketValueMillions': {
      if (typeof player.stats.marketValueMillions === 'number') {
        return player.stats.marketValueMillions;
      }
      const m = player.marketValue.match(/€(\d+(?:\.\d+)?)M/);
      return m ? parseFloat(m[1]) : 100;
    }
  }
}

export function getPlayerXG(player: PlayerProfile): number {
  if (typeof player.stats.xG === 'number') return player.stats.xG;
  return Number((player.stats.goals / 1.14).toFixed(2));
}

export function getPlayerDeltaXG(player: PlayerProfile): number {
  if (typeof player.stats.deltaXG === 'number') return player.stats.deltaXG;
  return Number((player.stats.goals - getPlayerXG(player)).toFixed(2));
}

export function getPlayerPercentileRank(player: PlayerProfile): number {
  if (typeof player.stats.percentileRank === 'number') return player.stats.percentileRank;
  const rp = player.radarPercentiles;
  const avg =
    (rp.scoring +
      rp.creativity +
      rp.progression +
      rp.paceAndPhysical +
      rp.defensiveWork +
      rp.bigGameImpact) /
    6;
  return Number(Math.min(99.9, avg).toFixed(1));
}

function computeQuantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

interface EdaCorrelationLabProps {
  allPlayers: PlayerProfile[];
  filteredPlayers: PlayerProfile[];
  filterLabel: string;
  activeGroupFilter: 'all' | 'squad_2026_27' | 'three_peat' | 'all_legends';
  activePosFilter: 'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD';
  onGroupFilterChange: (group: 'all' | 'squad_2026_27' | 'three_peat' | 'all_legends') => void;
  onPosFilterChange: (pos: 'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD') => void;
  viewMode: 'cards' | 'matrix';
  onViewModeChange: (mode: 'cards' | 'matrix') => void;
  onSelectPlayer: (player: PlayerProfile) => void;
  lang: Language;
}

export const EdaCorrelationLab: React.FC<EdaCorrelationLabProps> = ({
  allPlayers,
  filteredPlayers,
  filterLabel,
  activeGroupFilter,
  activePosFilter,
  onGroupFilterChange,
  onPosFilterChange,
  viewMode,
  onViewModeChange,
  onSelectPlayer,
  lang,
}) => {
  const [xAxisKey, setXAxisKey] = useState<MetricKey>('topSpeedKmh');
  const [yAxisKey, setYAxisKey] = useState<MetricKey>('gaPer90');
  const [scatterScope, setScatterScope] = useState<'all' | 'filtered'>('all');
  const [hoveredPlayer, setHoveredPlayer] = useState<PlayerProfile | null>(null);

  const activeScatterPlayers =
    scatterScope === 'all'
      ? allPlayers
      : filteredPlayers.length > 0
      ? filteredPlayers
      : allPlayers;

  const xDef =
    METRIC_DEFINITIONS.find((m) => m.key === xAxisKey) ?? METRIC_DEFINITIONS[0];
  const yDef =
    METRIC_DEFINITIONS.find((m) => m.key === yAxisKey) ?? METRIC_DEFINITIONS[1];

  // 1. Compute OLS Linear Regression (y = a*x + b), Pearson r, R^2, and Quadrant Means (mu_X, mu_Y)
  const regressionStats = useMemo(() => {
    const n = activeScatterPlayers.length;
    if (n === 0) {
      return {
        meanX: 0,
        meanY: 0,
        slope: 0,
        intercept: 0,
        r: 0,
        rSquared: 0,
        minX: 0,
        maxX: 1,
        minY: 0,
        maxY: 1,
        q1Count: 0,
        q2Count: 0,
        q3Count: 0,
        q4Count: 0,
      };
    }

    const xs = activeScatterPlayers.map((p) => extractPlayerMetric(p, xAxisKey));
    const ys = activeScatterPlayers.map((p) => extractPlayerMetric(p, yAxisKey));

    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let denX = 0;
    let denY = 0;
    let q1 = 0;
    let q2 = 0;
    let q3 = 0;
    let q4 = 0;

    for (let i = 0; i < n; i++) {
      const dx = xs[i] - meanX;
      const dy = ys[i] - meanY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;

      if (xs[i] >= meanX && ys[i] >= meanY) q1++;
      else if (xs[i] < meanX && ys[i] >= meanY) q2++;
      else if (xs[i] < meanX && ys[i] < meanY) q3++;
      else q4++;
    }

    const slope = denX > 1e-9 ? num / denX : 0;
    const intercept = meanY - slope * meanX;
    const r = denX > 1e-9 && denY > 1e-9 ? num / Math.sqrt(denX * denY) : 0;
    const rSquared = r * r;

    const rawMinX = Math.min(...xs);
    const rawMaxX = Math.max(...xs);
    const rawMinY = Math.min(...ys);
    const rawMaxY = Math.max(...ys);

    const padX = (rawMaxX - rawMinX || 1) * 0.08;
    const padY = (rawMaxY - rawMinY || 1) * 0.1;

    return {
      meanX,
      meanY,
      slope,
      intercept,
      r,
      rSquared,
      minX: rawMinX - padX,
      maxX: rawMaxX + padX,
      minY: Math.max(0, rawMinY - padY),
      maxY: rawMaxY + padY,
      q1Count: q1,
      q2Count: q2,
      q3Count: q3,
      q4Count: q4,
    };
  }, [activeScatterPlayers, xAxisKey, yAxisKey]);

  // 2. Compute Real-Time Dataset Summary Statistics for Active Filtered Group
  const summaryStats = useMemo(() => {
    const pool = filteredPlayers.length > 0 ? filteredPlayers : allPlayers;
    const n = pool.length;

    const gaList = pool.map((p) => p.stats.gaPer90).sort((a, b) => a - b);
    const meanGa = gaList.reduce((a, b) => a + b, 0) / n;
    const medianGa = computeQuantile(gaList, 0.5);

    const speedList = pool.map((p) => p.stats.topSpeedKmh).sort((a, b) => a - b);
    const meanSpeed = speedList.reduce((a, b) => a + b, 0) / n;
    const varianceSpeed =
      speedList.reduce((acc, val) => acc + (val - meanSpeed) ** 2, 0) / n;
    const stdSpeed = Math.sqrt(varianceSpeed);
    const q1Speed = computeQuantile(speedList, 0.25);
    const q3Speed = computeQuantile(speedList, 0.75);
    const iqrSpeed = q3Speed - q1Speed;

    const topOutlier = [...pool].sort(
      (a, b) => b.stats.eraZScore - a.stats.eraZScore
    )[0];

    const deltaXGs = pool.map((p) => getPlayerDeltaXG(p));
    const totalDeltaXG = deltaXGs.reduce((a, b) => a + b, 0);
    const meanDeltaXG = totalDeltaXG / n;

    return {
      count: n,
      meanGa,
      medianGa,
      stdSpeed,
      iqrSpeed,
      q1Speed,
      q3Speed,
      topOutlier,
      meanDeltaXG,
      totalDeltaXG,
    };
  }, [allPlayers, filteredPlayers]);

  // 3. Export CSV Handler (UTF-8 with BOM for Excel compatibility)
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Full Name',
      'Category',
      'Shirt Number',
      'Position Group',
      'Specific Positions',
      'Nationality',
      'Era',
      'Appearances',
      'Goals',
      'Expected Goals (xG)',
      'Goal Overperformance (Delta xG)',
      'Assists',
      'G+A per 90',
      'Top Speed (km/h)',
      'Era Z-Score (sigma)',
      'Percentile Rank (%)',
      'Market Value (€M)',
    ];

    const rows = allPlayers.map((p) => [
      p.id,
      `"${(p.fullName ?? p.name).replace(/"/g, '""')}"`,
      p.category === 'squad_2026_27' ? 'Squad 2026/27' : 'All-Time Legend',
      p.shirtNumber,
      p.positionGroup,
      `"${p.specificPositions.join('/')}"`,
      `"${p.nationality[lang]}"`,
      `"${p.era}"`,
      p.stats.appearances,
      p.stats.goals,
      getPlayerXG(p).toFixed(2),
      getPlayerDeltaXG(p).toFixed(2),
      p.stats.assists,
      p.stats.gaPer90.toFixed(2),
      p.stats.topSpeedKmh.toFixed(1),
      p.stats.eraZScore.toFixed(2),
      getPlayerPercentileRank(p).toFixed(1),
      extractPlayerMetric(p, 'marketValueMillions').toFixed(0),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'real_madrid_analytics_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // SVG Coordinate Mappers (ViewBox: 760 x 340)
  const padLeft = 58;
  const padRight = 28;
  const padTop = 26;
  const padBottom = 42;
  const plotW = 760 - padLeft - padRight;
  const plotH = 340 - padTop - padBottom;

  const mapX = (val: number) => {
    const span = regressionStats.maxX - regressionStats.minX || 1;
    return padLeft + ((val - regressionStats.minX) / span) * plotW;
  };

  const mapY = (val: number) => {
    const span = regressionStats.maxY - regressionStats.minY || 1;
    return padTop + plotH - ((val - regressionStats.minY) / span) * plotH;
  };

  const meanSvgX = Math.min(
    Math.max(mapX(regressionStats.meanX), padLeft),
    padLeft + plotW
  );
  const meanSvgY = Math.min(
    Math.max(mapY(regressionStats.meanY), padTop),
    padTop + plotH
  );

  // Regression Line Endpoints clamped to plot bounds
  const regY1 =
    regressionStats.slope * regressionStats.minX + regressionStats.intercept;
  const regY2 =
    regressionStats.slope * regressionStats.maxX + regressionStats.intercept;

  const spotlightPlayer =
    hoveredPlayer ??
    summaryStats.topOutlier ??
    activeScatterPlayers[0] ??
    null;

  return (
    <div className="space-y-6 mb-10">
      {/* ==========================================================================
         0. REAL-TIME DATASET COHORT & POSITION FILTER BAR
         ========================================================================== */}
      <div className="glass-royal rounded-2xl p-4 border border-[#D4AF37]/35 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F5D061] mr-1">
            {lang === 'vi' ? 'Bộ lọc Nhóm dữ liệu:' : 'Dataset Cohort:'}
          </span>
          {(
            [
              {
                id: 'all',
                labelVi: `Tất cả (${allPlayers.length})`,
                labelEn: `All Players (${allPlayers.length})`,
              },
              {
                id: 'squad_2026_27',
                labelVi: 'Đội hình 2026/27 (32)',
                labelEn: '2026/27 Squad (32)',
              },
              {
                id: 'three_peat',
                labelVi: 'Huyền thoại Ăn 3 C1 (18)',
                labelEn: '3-Peat UCL Legends (18)',
              },
              {
                id: 'all_legends',
                labelVi: 'Đại Sảnh Huyền Thoại (42)',
                labelEn: 'All-Time Legends (42)',
              },
            ] as const
          ).map((g) => (
            <button
              key={g.id}
              onClick={() => onGroupFilterChange(g.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeGroupFilter === g.id
                  ? 'bg-[#D4AF37] text-[#060913] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#0D1326] text-slate-300 border border-white/10 hover:border-[#D4AF37]/50'
              }`}
            >
              {lang === 'vi' ? g.labelVi : g.labelEn}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400">
            {lang === 'vi' ? 'Vị trí:' : 'Position:'}
          </span>
          <div className="flex items-center bg-[#0D1326] p-1 rounded-xl border border-white/10">
            {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => onPosFilterChange(pos)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  activePosFilter === pos
                    ? 'bg-[#16203D] text-[#F5D061] border border-[#D4AF37]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================================================
         1. DATASET SUMMARY STATISTICS (4 REAL-TIME DESCRIPTIVE STAT CARDS)
         ========================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Mean & Median of G+A/90 */}
        <div className="glass-royal royal-card-hover rounded-2xl p-4 border border-[#D4AF37]/35">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#F5D061] mb-1">
            <span>
              {lang === 'vi'
                ? '1. Hiệu Suất G+A/90 (μ & Trung vị)'
                : '1. G+A/90 Distribution (μ & Med)'}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#16203D] text-[10px] text-slate-300">
              N = {summaryStats.count}
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                {lang === 'vi' ? 'Trung bình (μ)' : 'Mean (μ)'}
              </span>
              <span className="text-2xl font-black text-white">
                {summaryStats.meanGa.toFixed(2)}
              </span>
            </div>
            <div className="h-7 w-px bg-white/10" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                {lang === 'vi' ? 'Trung vị (Q₂)' : 'Median (Q₂)'}
              </span>
              <span className="text-xl font-extrabold text-emerald-400">
                {summaryStats.medianGa.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-medium truncate">
            {lang === 'vi' ? `Nhóm đang lọc: ${filterLabel}` : `Active subset: ${filterLabel}`}
          </div>
        </div>

        {/* Card 2: Standard Deviation & IQR of Sprint Speed km/h */}
        <div className="glass-royal royal-card-hover rounded-2xl p-4 border border-[#D4AF37]/35">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-sky-400 mb-1">
            <span>
              {lang === 'vi'
                ? '2. Độ Phân Tán Tốc Độ (σ & IQR)'
                : '2. Speed Dispersion (σ & IQR)'}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#16203D] text-[10px] text-sky-300">
              km/h
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                {lang === 'vi' ? 'Độ lệch chuẩn (σ)' : 'Std Dev (σ)'}
              </span>
              <span className="text-2xl font-black text-white">
                ±{summaryStats.stdSpeed.toFixed(2)}
              </span>
            </div>
            <div className="h-7 w-px bg-white/10" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                IQR (Q₃ − Q₁)
              </span>
              <span className="text-xl font-extrabold text-sky-400">
                {summaryStats.iqrSpeed.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-medium">
            Q₁: {summaryStats.q1Speed.toFixed(1)} km/h → Q₃: {summaryStats.q3Speed.toFixed(1)} km/h
          </div>
        </div>

        {/* Card 3: Top 1 Statistical Outlier (Highest Era Z-Score) */}
        <div
          onClick={() =>
            summaryStats.topOutlier && onSelectPlayer(summaryStats.topOutlier)
          }
          className="glass-royal royal-card-hover cursor-pointer rounded-2xl p-4 border border-[#D4AF37]/50"
        >
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#F5D061] mb-1">
            <span>
              {lang === 'vi'
                ? '3. Điểm Chuẩn Hóa Cao Nhất (Z)'
                : '3. Top 1 Statistical Outlier'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#F5D061]" />
          </div>
          {summaryStats.topOutlier && (
            <>
              <div className="flex items-center justify-between mt-1">
                <div className="text-base font-black text-white truncate pr-2">
                  {summaryStats.topOutlier.name}
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#060913] font-black text-xs shrink-0">
                  +{summaryStats.topOutlier.stats.eraZScore.toFixed(2)}σ
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                <span>
                  G+A/90: {summaryStats.topOutlier.stats.gaPer90.toFixed(2)} •{' '}
                  {summaryStats.topOutlier.stats.topSpeedKmh} km/h
                </span>
                <span className="text-[#F5D061] underline">
                  {lang === 'vi' ? 'Hồ sơ →' : 'Profile →'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Card 4: Mean Expected Goals Overperformance (Delta xG = Goals - xG) */}
        <div className="glass-royal royal-card-hover rounded-2xl p-4 border border-[#D4AF37]/35">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
            <span>
              {lang === 'vi'
                ? '4. Hiệu Suất Vượt Kỳ Vọng (ΔxG)'
                : '4. xG Overperformance (ΔxG)'}
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                {lang === 'vi' ? 'TB ΔxG (Bàn thắng − xG)' : 'Mean ΔxG'}
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {summaryStats.meanDeltaXG >= 0 ? '+' : ''}
                {summaryStats.meanDeltaXG.toFixed(2)}
              </span>
            </div>
            <div className="h-7 w-px bg-white/10" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                {lang === 'vi' ? 'Tổng ∑ΔxG Nhóm' : 'Total ∑ΔxG'}
              </span>
              <span className="text-xl font-extrabold text-[#F5D061]">
                +{summaryStats.totalDeltaXG.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-medium">
            {lang === 'vi'
              ? 'Chứng minh kỹ năng dứt điểm vượt chuẩn xG'
              : 'Clinical finishing above expected xG baseline'}
          </div>
        </div>
      </div>

      {/* ==========================================================================
         2. PHÒNG THÍ NGHIỆM KHAI PHÁ DỮ LIỆU (EDA & CORRELATION LAB)
         ========================================================================== */}
      <div className="glass-royal rounded-2xl p-5 sm:p-7 border border-[#D4AF37]/40">
        {/* Header + Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#F5D061] mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>
                {lang === 'vi'
                  ? 'PHÂN TÍCH KHÁM PHÁ DỮ LIỆU • HỒI QUY TUYẾN TÍNH & PHÂN CỤM 4 GÓC'
                  : 'EXPLORATORY DATA ANALYSIS • OLS REGRESSION & 4-QUADRANT CLUSTERING'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'vi'
                ? 'PHÒNG THÍ NGHIỆM KHAI PHÁ & TƯƠNG QUAN DỮ LIỆU'
                : 'EXPLORATORY DATA ANALYSIS & CORRELATION LAB'}
            </h3>
          </div>

          {/* X-Axis, Y-Axis Selectors & Scope Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-[#0D1326] px-3 py-1.5 rounded-xl border border-[#D4AF37]/40">
              <span className="text-[11px] font-extrabold text-[#F5D061] uppercase">
                {lang === 'vi' ? 'Trục X:' : 'X-Axis:'}
              </span>
              <select
                value={xAxisKey}
                onChange={(e) => setXAxisKey(e.target.value as MetricKey)}
                className="bg-transparent text-xs font-extrabold text-white focus:outline-none cursor-pointer"
              >
                {METRIC_DEFINITIONS.map((m) => (
                  <option key={m.key} value={m.key} className="bg-[#0D1326] text-white">
                    {lang === 'vi' ? m.labelVi : m.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#0D1326] px-3 py-1.5 rounded-xl border border-sky-400/40">
              <span className="text-[11px] font-extrabold text-sky-400 uppercase">
                {lang === 'vi' ? 'Trục Y:' : 'Y-Axis:'}
              </span>
              <select
                value={yAxisKey}
                onChange={(e) => setYAxisKey(e.target.value as MetricKey)}
                className="bg-transparent text-xs font-extrabold text-white focus:outline-none cursor-pointer"
              >
                {METRIC_DEFINITIONS.map((m) => (
                  <option key={m.key} value={m.key} className="bg-[#0D1326] text-white">
                    {lang === 'vi' ? m.labelVi : m.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-[#0D1326] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setScatterScope('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                  scatterScope === 'all'
                    ? 'bg-[#D4AF37] text-[#060913]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {lang === 'vi'
                  ? `Tất cả (${allPlayers.length})`
                  : `All (${allPlayers.length})`}
              </button>
              <button
                onClick={() => setScatterScope('filtered')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                  scatterScope === 'filtered'
                    ? 'bg-[#D4AF37] text-[#060913]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {lang === 'vi'
                  ? `Theo bộ lọc (${filteredPlayers.length})`
                  : `Filtered (${filteredPlayers.length})`}
              </button>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout: Left 8 Cols Interactive 2D Scatter SVG | Right 4 Cols Regression & Hovered Player Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Interactive 2D Scatter Plot SVG */}
          <div className="keep-dark-surface lg:col-span-8 bg-[#060B18] rounded-2xl p-4 border border-[#D4AF37]/35 flex flex-col justify-between">
            {/* Top Legend Bar inside Canvas */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-bold text-[#F5D061]">
                  <span className="w-3 h-3 rounded-full bg-[#D4AF37] inline-block border border-white/60" />
                  {lang === 'vi' ? 'Huyền Thoại' : 'All-Time Legends'}
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-sky-400">
                  <span className="w-3 h-3 rounded-full bg-[#38BDF8] inline-block border border-white/60" />
                  {lang === 'vi' ? 'Đội Hình 2026/27' : '2026/27 Squad'}
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-rose-400">
                  <span className="w-4 h-0.5 bg-rose-500 inline-block" />
                  {lang === 'vi' ? 'Hồi quy:' : 'OLS:'} y = {regressionStats.slope.toFixed(3)}x{' '}
                  {regressionStats.intercept >= 0 ? '+' : '−'}{' '}
                  {Math.abs(regressionStats.intercept).toFixed(2)}
                </span>
              </div>
              <div className="font-extrabold text-emerald-400">
                {lang === 'vi' ? 'Hệ số r' : 'Pearson r'} = {regressionStats.r >= 0 ? '+' : ''}
                {regressionStats.r.toFixed(3)} • R² ={' '}
                {(regressionStats.rSquared * 100).toFixed(1)}%
              </div>
            </div>

            <svg
              viewBox="0 0 760 340"
              className="w-full h-auto bg-[#040812] rounded-xl border border-white/10 select-none overflow-visible"
            >
              {/* 4 Quadrant Subtle Backgrounds */}
              {/* Q2: Top-Left */}
              <rect
                x={padLeft}
                y={padTop}
                width={Math.max(0, meanSvgX - padLeft)}
                height={Math.max(0, meanSvgY - padTop)}
                fill="rgba(56, 189, 248, 0.035)"
              />
              {/* Q1: Top-Right (Elite Quadrant) */}
              <rect
                x={meanSvgX}
                y={padTop}
                width={Math.max(0, padLeft + plotW - meanSvgX)}
                height={Math.max(0, meanSvgY - padTop)}
                fill="rgba(212, 175, 55, 0.07)"
              />
              {/* Q3: Bottom-Left */}
              <rect
                x={padLeft}
                y={meanSvgY}
                width={Math.max(0, meanSvgX - padLeft)}
                height={Math.max(0, padTop + plotH - meanSvgY)}
                fill="rgba(148, 163, 184, 0.02)"
              />
              {/* Q4: Bottom-Right */}
              <rect
                x={meanSvgX}
                y={meanSvgY}
                width={Math.max(0, padLeft + plotW - meanSvgX)}
                height={Math.max(0, padTop + plotH - meanSvgY)}
                fill="rgba(16, 185, 129, 0.035)"
              />

              {/* Horizontal & Vertical Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const yVal =
                  regressionStats.minY +
                  t * (regressionStats.maxY - regressionStats.minY);
                const yPos = mapY(yVal);
                return (
                  <g key={`hy-${t}`}>
                    <line
                      x1={padLeft}
                      y1={yPos}
                      x2={padLeft + plotW}
                      y2={yPos}
                      stroke="rgba(255,255,255,0.07)"
                      strokeWidth="1"
                    />
                    <text
                      x={padLeft - 8}
                      y={yPos + 3}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontWeight="700"
                    >
                      {yVal.toFixed(yDef.decimals)}
                    </text>
                  </g>
                );
              })}

              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const xVal =
                  regressionStats.minX +
                  t * (regressionStats.maxX - regressionStats.minX);
                const xPos = mapX(xVal);
                return (
                  <g key={`vx-${t}`}>
                    <line
                      x1={xPos}
                      y1={padTop}
                      x2={xPos}
                      y2={padTop + plotH}
                      stroke="rgba(255,255,255,0.07)"
                      strokeWidth="1"
                    />
                    <text
                      x={xPos}
                      y={padTop + plotH + 15}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontWeight="700"
                    >
                      {xVal.toFixed(xDef.decimals)}
                    </text>
                  </g>
                );
              })}

              {/* 4 Quadrant Labels */}
              <text
                x={padLeft + plotW - 8}
                y={padTop + 14}
                textAnchor="end"
                fill="#F5D061"
                fontSize="9.5"
                fontWeight="800"
              >
                {lang === 'vi'
                  ? `Góc I (X ≥ μ, Y ≥ μ): Siêu Hiệu Suất & Đột Biến (${regressionStats.q1Count})`
                  : `Quadrant I (X ≥ μ, Y ≥ μ): Elite Outliers (${regressionStats.q1Count})`}
              </text>
              <text
                x={padLeft + 8}
                y={padTop + 14}
                textAnchor="start"
                fill="#38BDF8"
                fontSize="9"
                fontWeight="700"
              >
                {lang === 'vi'
                  ? `Góc II (Y ≥ μ): Chuyên Gia Cường Độ Cao (${regressionStats.q2Count})`
                  : `Quadrant II (Y ≥ μ): High-Intensity Specialists (${regressionStats.q2Count})`}
              </text>
              <text
                x={padLeft + 8}
                y={padTop + plotH - 8}
                textAnchor="start"
                fill="#94a3b8"
                fontSize="9"
                fontWeight="700"
              >
                {lang === 'vi'
                  ? `Góc III: Phòng Ngự / Kiến Thiết Lùi Sâu (${regressionStats.q3Count})`
                  : `Quadrant III: Deep-Lying / Defensive Base (${regressionStats.q3Count})`}
              </text>
              <text
                x={padLeft + plotW - 8}
                y={padTop + plotH - 8}
                textAnchor="end"
                fill="#34d399"
                fontSize="9"
                fontWeight="700"
              >
                {lang === 'vi'
                  ? `Góc IV (X ≥ μ): Bền Bỉ & Trụ Cột (${regressionStats.q4Count})`
                  : `Quadrant IV (X ≥ μ): High-Volume Pillars (${regressionStats.q4Count})`}
              </text>

              {/* Mean Lines (mu_X and mu_Y) */}
              <line
                x1={meanSvgX}
                y1={padTop}
                x2={meanSvgX}
                y2={padTop + plotH}
                stroke="rgba(245, 208, 97, 0.55)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <text
                x={meanSvgX + 4}
                y={padTop + plotH - 22}
                fill="#F5D061"
                fontSize="8.5"
                fontWeight="800"
              >
                μX = {regressionStats.meanX.toFixed(xDef.decimals)}
              </text>

              <line
                x1={padLeft}
                y1={meanSvgY}
                x2={padLeft + plotW}
                y2={meanSvgY}
                stroke="rgba(56, 189, 248, 0.55)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <text
                x={padLeft + 6}
                y={meanSvgY - 5}
                fill="#38BDF8"
                fontSize="8.5"
                fontWeight="800"
              >
                μY = {regressionStats.meanY.toFixed(yDef.decimals)}
              </text>

              {/* Linear Regression Line (y = ax + b) */}
              <line
                x1={mapX(regressionStats.minX)}
                y1={Math.min(
                  Math.max(mapY(regY1), padTop),
                  padTop + plotH
                )}
                x2={mapX(regressionStats.maxX)}
                y2={Math.min(
                  Math.max(mapY(regY2), padTop),
                  padTop + plotH
                )}
                stroke="#F43F5E"
                strokeWidth="2.2"
                strokeDasharray="6 3"
              />

              {/* Axis Titles */}
              <text
                x={padLeft + plotW / 2}
                y={332}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="10.5"
                fontWeight="800"
              >
                {lang === 'vi' ? xDef.labelVi : xDef.labelEn}
              </text>
              <text
                x={15}
                y={padTop + plotH / 2}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="10.5"
                fontWeight="800"
                transform={`rotate(-90 15 ${padTop + plotH / 2})`}
              >
                {lang === 'vi' ? yDef.labelVi : yDef.labelEn}
              </text>

              {/* Player Scatter Nodes */}
              {activeScatterPlayers.map((p) => {
                const xVal = extractPlayerMetric(p, xAxisKey);
                const yVal = extractPlayerMetric(p, yAxisKey);
                const cx = mapX(xVal);
                const cy = mapY(yVal);
                const isLegend = p.category === 'legend';
                const isHovered = spotlightPlayer?.id === p.id;
                const isKeyStar =
                  p.id === 'cristiano-ronaldo' ||
                  p.id === 'kylian-mbappe' ||
                  p.id === 'jude-bellingham' ||
                  p.id === 'vinicius-junior' ||
                  p.id === 'alfredo-di-stefano';

                return (
                  <g
                    key={p.id}
                    onMouseEnter={() => setHoveredPlayer(p)}
                    onClick={() => onSelectPlayer(p)}
                    className="cursor-pointer"
                  >
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={11}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.8"
                        strokeOpacity="0.85"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 7 : isKeyStar ? 5.5 : 4.5}
                      fill={isLegend ? '#D4AF37' : '#38BDF8'}
                      fillOpacity={isHovered ? 1 : 0.85}
                      stroke={isHovered ? '#FFFFFF' : '#060913'}
                      strokeWidth={isHovered ? 2 : 1}
                    />
                    {(isHovered || isKeyStar) && (
                      <text
                        x={cx}
                        y={cy - 9}
                        textAnchor="middle"
                        fill={isHovered ? '#FFFFFF' : isLegend ? '#F5D061' : '#7DD3FC'}
                        fontSize={isHovered ? '10' : '8.5'}
                        fontWeight="800"
                      >
                        {p.name.split(' ').pop()}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
              <span>
                {lang === 'vi'
                  ? '💡 Rê chuột lên bất kỳ điểm nào để xem phân tích định lượng; bấm trực tiếp vào điểm để mở Hồ sơ 2 cột.'
                  : '💡 Hover over any point to inspect metrics; click any dot to open the 2-Column Profile Dossier.'}
              </span>
              <span className="text-[#F5D061] font-bold">
                {Math.abs(regressionStats.r) >= 0.5
                  ? lang === 'vi'
                    ? 'Tương quan tuyến tính mạnh'
                    : 'Strong linear correlation'
                  : Math.abs(regressionStats.r) >= 0.25
                  ? lang === 'vi'
                    ? 'Tương quan tuyến tính trung bình'
                    : 'Moderate correlation'
                  : lang === 'vi'
                  ? 'Phân tán đa chiều độc lập'
                  : 'Multi-dimensional dispersion'}
              </span>
            </div>
          </div>

          {/* Right: Interactive Hovered Player Tooltip Card + Statistical Model Summary */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            {spotlightPlayer && (
              <div className="bg-[#0D1326] rounded-2xl p-4 sm:p-5 border-2 border-[#D4AF37]/60 shadow-xl space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D061]">
                    {spotlightPlayer.category === 'legend'
                      ? lang === 'vi'
                        ? 'Huyền Thoại Hoàng Gia'
                        : 'All-Time Legend'
                      : lang === 'vi'
                      ? 'Đội Hình 2026/27'
                      : 'Squad 2026/27'}
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    {lang === 'vi' ? 'Phân vị' : 'Percentile'}: {getPlayerPercentileRank(spotlightPlayer)}%
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="keep-dark-surface w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shrink-0 bg-[#060913]">
                    <PlayerAvatar
                      src={spotlightPlayer.imageUrl}
                      name={spotlightPlayer.name}
                      shirtNumber={spotlightPlayer.shirtNumber}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-black text-white truncate">
                      {spotlightPlayer.name}
                    </h4>
                    <div className="text-xs font-bold text-[#F5D061] flex items-center flex-wrap">
                      <CountryFlag nationality={spotlightPlayer.nationality} />
                      <span>
                        {spotlightPlayer.specificPositions.join('/')} • {spotlightPlayer.era}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      {lang === 'vi' ? 'Điểm chuẩn hóa (Z)' : 'Z-Score'}: +{spotlightPlayer.stats.eraZScore.toFixed(2)}σ
                    </div>
                  </div>
                </div>

                {/* Selected X & Y Metrics + xG Overperformance */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#060913] p-2.5 rounded-xl border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold truncate">
                      X: {lang === 'vi' ? xDef.labelVi : xDef.labelEn}
                    </div>
                    <div className="text-sm font-black text-[#F5D061] mt-0.5">
                      {extractPlayerMetric(spotlightPlayer, xAxisKey).toFixed(
                        xDef.decimals
                      )}{' '}
                      {xDef.unit}
                    </div>
                  </div>
                  <div className="bg-[#060913] p-2.5 rounded-xl border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold truncate">
                      Y: {lang === 'vi' ? yDef.labelVi : yDef.labelEn}
                    </div>
                    <div className="text-sm font-black text-sky-400 mt-0.5">
                      {extractPlayerMetric(spotlightPlayer, yAxisKey).toFixed(
                        yDef.decimals
                      )}{' '}
                      {yDef.unit}
                    </div>
                  </div>
                  <div className="bg-[#060913] p-2.5 rounded-xl border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold">
                      {lang === 'vi' ? 'Bàn thắng vs xG' : 'Goals vs xG'}
                    </div>
                    <div className="text-xs font-extrabold text-white mt-0.5">
                      {spotlightPlayer.stats.goals} {lang === 'vi' ? 'bàn' : 'G'} / {getPlayerXG(spotlightPlayer).toFixed(2)} xG
                    </div>
                  </div>
                  <div className="bg-[#060913] p-2.5 rounded-xl border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold">
                      {lang === 'vi' ? 'ΔxG (Bàn − xG)' : 'ΔxG (Goals − xG)'}
                    </div>
                    <div className="text-xs font-extrabold text-emerald-400 mt-0.5">
                      {getPlayerDeltaXG(spotlightPlayer) >= 0 ? '+' : ''}
                      {getPlayerDeltaXG(spotlightPlayer).toFixed(2)} {lang === 'vi' ? 'bàn' : 'G'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPlayer(spotlightPlayer)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#060913] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>
                    {lang === 'vi'
                      ? `Mở Hồ Sơ Chi Tiết: ${spotlightPlayer.name}`
                      : `Open Profile: ${spotlightPlayer.name}`}
                  </span>
                </button>
              </div>
            )}

            {/* OLS Regression Equation & Quadrant Breakdown Box */}
            <div className="bg-[#060913]/90 rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
              <div className="font-extrabold uppercase tracking-wider text-[#F5D061]">
                {lang === 'vi'
                  ? 'Mô Hình Hồi Quy Tuyến Tính (OLS):'
                  : 'OLS Linear Regression Model:'}
              </div>
              <div className="p-2.5 rounded-xl bg-[#0D1326] border border-[#D4AF37]/30 font-extrabold text-white flex items-center justify-between">
                <span>
                  y = {regressionStats.slope.toFixed(3)}x{' '}
                  {regressionStats.intercept >= 0 ? '+' : '−'}{' '}
                  {Math.abs(regressionStats.intercept).toFixed(2)}
                </span>
                <span className="text-[#F5D061]">
                  r = {regressionStats.r.toFixed(3)}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'vi'
                  ? `Đường trung bình chia ${activeScatterPlayers.length} cầu thủ thành 4 góc phần tư: Góc I dẫn đầu cả 2 chỉ số (${regressionStats.q1Count} cầu thủ), Góc II mạnh về ${yDef.labelVi} (${regressionStats.q2Count}), Góc IV mạnh về ${xDef.labelVi} (${regressionStats.q4Count}).`
                  : `Mean lines divide ${activeScatterPlayers.length} players into 4 quadrants: Quadrant I leads both metrics (${regressionStats.q1Count} players).`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
         3. VIEW MODE TOGGLE BAR (🗂️ XEM THẺ CẦU THỦ vs 📊 BẢNG MA TRẬN DỮ LIỆU + 📥 XUẤT CSV)
         ========================================================================== */}
      <div className="glass-royal rounded-2xl p-4 sm:p-5 border border-[#D4AF37]/45 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onViewModeChange('cards')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
              viewMode === 'cards'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#060913] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                : 'bg-[#0D1326] text-slate-300 border border-white/10 hover:border-[#D4AF37]/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>
              {lang === 'vi'
                ? '🗂️ Xem Thẻ Cầu Thủ'
                : '🗂️ View Player Cards'}
            </span>
          </button>

          <button
            onClick={() => onViewModeChange('matrix')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
              viewMode === 'matrix'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#060913] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                : 'bg-[#0D1326] text-slate-300 border border-white/10 hover:border-[#D4AF37]/50'
            }`}
          >
            <Table2 className="w-4 h-4" />
            <span>
              {lang === 'vi'
                ? '📊 Xem Bảng Ma Trận Dữ Liệu'
                : '📊 View Quantitative Data Matrix'}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-400">
            {lang === 'vi'
              ? `Đang hiển thị: ${filteredPlayers.length} / ${allPlayers.length} cầu thủ`
              : `Showing: ${filteredPlayers.length} / ${allPlayers.length} players`}
          </span>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/60 text-emerald-300 text-xs font-extrabold flex items-center gap-2 transition-all shadow whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>
              {lang === 'vi'
                ? '📥 Xuất Dữ Liệu (.CSV)'
                : '📥 Export Dataset (.CSV)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface QuantitativeDataMatrixProps {
  players: PlayerProfile[];
  comparedIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectPlayer: (player: PlayerProfile) => void;
  lang: Language;
}

export const QuantitativeDataMatrix: React.FC<QuantitativeDataMatrixProps> = ({
  players,
  comparedIds,
  onToggleCompare,
  onSelectPlayer,
  lang,
}) => {
  const [sortKey, setSortKey] = useState<MatrixSortKey>('eraZScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: MatrixSortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  };

  const sortedPlayers = useMemo(() => {
    const copy = [...players];
    copy.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;
      switch (sortKey) {
        case 'name':
          valA = a.name;
          valB = b.name;
          return sortDir === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        case 'appearances':
          valA = a.stats.appearances;
          valB = b.stats.appearances;
          break;
        case 'goals':
          valA = a.stats.goals;
          valB = b.stats.goals;
          break;
        case 'assists':
          valA = a.stats.assists;
          valB = b.stats.assists;
          break;
        case 'gaPer90':
          valA = a.stats.gaPer90;
          valB = b.stats.gaPer90;
          break;
        case 'xG':
          valA = getPlayerXG(a);
          valB = getPlayerXG(b);
          break;
        case 'deltaXG':
          valA = getPlayerDeltaXG(a);
          valB = getPlayerDeltaXG(b);
          break;
        case 'topSpeedKmh':
          valA = a.stats.topSpeedKmh;
          valB = b.stats.topSpeedKmh;
          break;
        case 'eraZScore':
          valA = a.stats.eraZScore;
          valB = b.stats.eraZScore;
          break;
        case 'percentileRank':
          valA = getPlayerPercentileRank(a);
          valB = getPlayerPercentileRank(b);
          break;
      }
      return sortDir === 'asc'
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
    return copy;
  }, [players, sortKey, sortDir]);

  const maxApps = Math.max(...players.map((p) => p.stats.appearances), 1);
  const maxGoals = Math.max(...players.map((p) => p.stats.goals), 1);
  const maxAssists = Math.max(...players.map((p) => p.stats.assists), 1);
  const maxGa90 = Math.max(...players.map((p) => p.stats.gaPer90), 1);

  const renderSortHeader = (key: MatrixSortKey, label: string) => {
    const active = sortKey === key;
    return (
      <th
        onClick={() => handleSort(key)}
        className="py-3 px-2.5 cursor-pointer select-none hover:text-[#F5D061] transition-colors whitespace-nowrap"
      >
        <div className="inline-flex items-center gap-1">
          <span className={active ? 'text-[#F5D061] font-black' : ''}>{label}</span>
          {active ? (
            sortDir === 'desc' ? (
              <ArrowDown className="w-3.5 h-3.5 text-[#F5D061]" />
            ) : (
              <ArrowUp className="w-3.5 h-3.5 text-[#F5D061]" />
            )
          ) : (
            <ArrowUpDown className="w-3 h-3 opacity-40" />
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="glass-royal animate-section-reveal rounded-2xl border border-[#D4AF37]/40 overflow-hidden mb-12">
      <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-base sm:text-lg font-black text-white">
            {lang === 'vi'
              ? 'BẢNG MA TRẬN DỮ LIỆU ĐỊNH LƯỢNG TOÀN DIỆN'
              : 'COMPREHENSIVE QUANTITATIVE DATA MATRIX'}
          </h4>
          <p className="text-xs text-slate-400">
            {lang === 'vi'
              ? 'Bấm vào tiêu đề bất kỳ cột nào để sắp xếp tăng/giảm dần; bấm vào cầu thủ để mở Hồ sơ chi tiết 2 cột.'
              : 'Click any column header to sort ascending/descending; click any row to open the 2-Column Profile Modal.'}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#16203D] border border-[#D4AF37]/40 text-xs font-extrabold text-[#F5D061]">
          {sortedPlayers.length} {lang === 'vi' ? 'hồ sơ định lượng' : 'records'}
        </span>
      </div>

      <div className="overflow-x-auto max-h-[680px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-20 bg-[#090F22] border-b border-[#D4AF37]/40 text-[11px] uppercase text-slate-300 font-extrabold">
            <tr>
              <th className="py-3 pl-4 pr-2">#</th>
              {renderSortHeader('name', lang === 'vi' ? 'Cầu thủ & Vị trí' : 'Player & Role')}
              {renderSortHeader('appearances', lang === 'vi' ? 'Trận' : 'Apps')}
              {renderSortHeader('goals', lang === 'vi' ? 'Bàn' : 'Goals')}
              {renderSortHeader('assists', lang === 'vi' ? 'Kiến tạo' : 'Assists')}
              {renderSortHeader('gaPer90', 'G+A/90')}
              {renderSortHeader('xG', 'xG (ΔxG)')}
              {renderSortHeader('topSpeedKmh', 'km/h')}
              {renderSortHeader('eraZScore', lang === 'vi' ? 'Điểm chuẩn hóa (Z)' : 'Era Z-Score')}
              {renderSortHeader('percentileRank', lang === 'vi' ? 'Phân vị (%)' : 'Percentile Rank %')}
              <th className="py-3 pr-4 pl-2 text-right">
                {lang === 'vi' ? 'Thao tác' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sortedPlayers.map((p, idx) => {
              const xg = getPlayerXG(p);
              const dxg = getPlayerDeltaXG(p);
              const pct = getPlayerPercentileRank(p);
              const isCompared = comparedIds.includes(p.id);
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelectPlayer(p)}
                  className="hover:bg-[#D4AF37]/10 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 pl-4 pr-2 font-extrabold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="keep-dark-surface w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37] shrink-0 bg-[#060913]">
                        <PlayerAvatar
                          src={p.imageUrl}
                          name={p.name}
                          shirtNumber={p.shirtNumber}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-white truncate flex items-center gap-1.5">
                          <span>{p.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#F5D061]">
                            #{p.shirtNumber}
                          </span>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 flex items-center">
                          <CountryFlag
                            nationality={p.nationality}
                            className="inline-block w-4 h-3 object-cover rounded-[2px] shadow-sm mr-1.5 align-middle"
                          />
                          <span>
                            {p.positionGroup} • {p.specificPositions.join('/')} • {p.era}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Appearances with inline bar */}
                  <td className="py-2.5 px-2.5">
                    <div className="font-bold text-white">{p.stats.appearances}</div>
                    <div className="w-16 h-1 rounded-full bg-white/10 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full"
                        style={{
                          width: `${Math.min(
                            (p.stats.appearances / maxApps) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </td>

                  {/* Goals with inline bar */}
                  <td className="py-2.5 px-2.5">
                    <div className="font-extrabold text-[#F5D061]">{p.stats.goals}</div>
                    <div className="w-16 h-1 rounded-full bg-white/10 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37] rounded-full"
                        style={{
                          width: `${Math.min((p.stats.goals / maxGoals) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </td>

                  {/* Assists with inline bar */}
                  <td className="py-2.5 px-2.5">
                    <div className="font-bold text-sky-400">{p.stats.assists}</div>
                    <div className="w-16 h-1 rounded-full bg-white/10 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-sky-400 rounded-full"
                        style={{
                          width: `${Math.min(
                            (p.stats.assists / maxAssists) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </td>

                  {/* G+A/90 with inline bar */}
                  <td className="py-2.5 px-2.5">
                    <div className="font-extrabold text-emerald-400">
                      {p.stats.gaPer90.toFixed(2)}
                    </div>
                    <div className="w-16 h-1 rounded-full bg-white/10 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{
                          width: `${Math.min(
                            (p.stats.gaPer90 / maxGa90) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </td>

                  {/* xG & Delta xG */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <div className="font-bold text-white">{xg.toFixed(2)}</div>
                    <div className="text-[10px] font-extrabold text-emerald-400">
                      {dxg >= 0 ? `+${dxg.toFixed(2)}` : dxg.toFixed(2)} ΔxG
                    </div>
                  </td>

                  {/* Top Speed km/h */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <span className="font-extrabold text-sky-400">
                      {p.stats.topSpeedKmh.toFixed(1)}
                    </span>
                  </td>

                  {/* Era Z-Score */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-[#16203D] border border-[#D4AF37]/40 font-extrabold text-[#F5D061]">
                      +{p.stats.eraZScore.toFixed(2)}σ
                    </span>
                  </td>

                  {/* Percentile Rank % with Visual Bar */}
                  <td className="py-2.5 px-2.5 min-w-[130px]">
                    <div className="flex items-center justify-between text-[11px] font-extrabold mb-1">
                      <span className="text-[#F5D061]">{pct.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-400">
                        {lang === 'vi'
                          ? `Nhóm ${(100 - pct).toFixed(1)}% đầu`
                          : `Top ${(100 - pct).toFixed(1)}%`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-emerald-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>

                  {/* Quick Actions */}
                  <td className="py-2.5 pr-4 pl-2 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompare(p.id);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border ${
                          isCompared
                            ? 'bg-[#D4AF37] text-[#060913] border-[#F5D061]'
                            : 'bg-[#16203D] text-slate-300 border-white/10'
                        }`}
                      >
                        Radar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPlayer(p);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5D061] text-[10px] font-extrabold"
                      >
                        {lang === 'vi' ? 'Hồ Sơ' : 'Profile'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
