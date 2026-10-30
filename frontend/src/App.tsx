import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  Cpu,
  FileSpreadsheet,
  GitCommit,
  Layers,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  SlidersHorizontal,
  Sun,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import rawAnalyticsData from './data/madrid_analytics.json';
import { Language, MadridAnalyticsDataset, PlayerProfile } from './types/database';
import { TimelineSection } from './components/TimelineSection';
import { TrophyMuseumSection } from './components/TrophyMuseumSection';
import { LegendsSquadLabSection, SquadLabCommand } from './components/LegendsSquadLabSection';
import { ClasicoRemontadaSection } from './components/ClasicoRemontadaSection';
import { TacticalMonteCarloSection } from './components/TacticalMonteCarloSection';
import { Madridista101Section } from './components/Madridista101Section';
import { PlayerAvatar } from './components/PlayerAvatar';
import { PlayerWalkoutModal } from './components/PlayerWalkoutModal';
import { CountryFlag } from './components/CountryFlag';

const dataset = rawAnalyticsData as unknown as MadridAnalyticsDataset;

type CurveTab = 'xg_trajectory' | 'remontada_curve' | 'trident_velocity';

interface CurveSeriesPoint {
  label: string;
  primary: number;
  secondary: number;
  annotation?: string;
}

const CURVE_DATASETS: Record<
  CurveTab,
  {
    titleVi: string;
    titleEn: string;
    primaryLabelVi: string;
    primaryLabelEn: string;
    secondaryLabelVi: string;
    secondaryLabelEn: string;
    unit: string;
    deltaBadge: string;
    points: CurveSeriesPoint[];
  }
> = {
  xg_trajectory: {
    titleVi: 'Đường Cong Hiệu Suất Bàn Thắng Thực Tế vs Kỳ Vọng (xG) • 2024–2026/27',
    titleEn: 'Cumulative Goals vs Expected Goals (xG) Smooth Curve • 2024–2026/27',
    primaryLabelVi: 'Bàn thắng thực tế (Goals)',
    primaryLabelEn: 'Actual Goals Scored',
    secondaryLabelVi: 'Bàn thắng kỳ vọng (xG)',
    secondaryLabelEn: 'Expected Goals (xG)',
    unit: 'G',
    deltaBadge: 'ΔxG +12.28 (#10 Mbappé 100G / 87.72 xG)',
    points: [
      { label: '08/2024', primary: 14, secondary: 11.8, annotation: 'UEFA Super Cup' },
      { label: '12/2024', primary: 42, secondary: 36.4, annotation: 'Intercontinental' },
      { label: '05/2025', primary: 88, secondary: 76.2 },
      { label: '10/2025', primary: 129, secondary: 112.5 },
      { label: '02/2026', primary: 174, secondary: 151.0 },
      { label: '05/2026', primary: 221, secondary: 192.4 },
      { label: '10/2026', primary: 267, secondary: 228.7, annotation: 'El Clásico 1–2' },
    ],
  },
  remontada_curve: {
    titleVi: 'Đường Cong Mật Độ Bàn Thắng Theo Khung Thời Gian (DNA Remontada 76’–90+’)',
    titleEn: 'Goal Probability Density Curve Across 15-Minute Match Intervals',
    primaryLabelVi: 'Tỷ trọng bàn thắng Real Madrid (%)',
    primaryLabelEn: 'Real Madrid Goal Share (%)',
    secondaryLabelVi: 'Trung bình chuẩn Châu Âu (%)',
    secondaryLabelEn: 'European Baseline (%)',
    unit: '%',
    deltaBadge: '76’–90+’ Surge: 29.4% (χ² p < 0.001)',
    points: [
      { label: "01'–15'", primary: 12.2, secondary: 14.5 },
      { label: "16'–30'", primary: 14.8, secondary: 15.8 },
      { label: "31'–45+'", primary: 16.4, secondary: 16.9 },
      { label: "46'–60'", primary: 13.9, secondary: 16.2 },
      { label: "61'–75'", primary: 14.9, secondary: 17.4 },
      { label: "76'–90+'", primary: 29.4, secondary: 19.2, annotation: 'DNA Remontada' },
    ],
  },
  trident_velocity: {
    titleVi: 'Đường Cong Tương Quan Tốc Độ Bứt Tốc (km/h) & Hiệu Suất G+A/90',
    titleEn: 'Peak Sprint Velocity (km/h) & G+A/90 Output Curve (Squad Core)',
    primaryLabelVi: 'Vận tốc cực đại (km/h)',
    primaryLabelEn: 'Peak Sprint Speed (km/h)',
    secondaryLabelVi: 'Chỉ số chuẩn hóa G+A (×30)',
    secondaryLabelEn: 'Normalized G+A Index (×30)',
    unit: 'km/h',
    deltaBadge: 'Peak: 36.6 km/h (#10 Mbappé • 1.08 G+A/90)',
    points: [
      { label: '#12 Trent', primary: 33.4, secondary: 24.5 },
      { label: '#8 Valverde', primary: 35.3, secondary: 26.8 },
      { label: '#5 Bellingham', primary: 34.4, secondary: 29.4 },
      { label: '#25 Diomande', primary: 35.9, secondary: 31.2 },
      { label: '#7 Vinícius Jr', primary: 36.2, secondary: 32.8 },
      { label: '#10 Mbappé', primary: 36.6, secondary: 35.4, annotation: '100G Milestone' },
    ],
  },
};

/**
 * Generates a smooth Cubic-Bezier SVG path (Catmull-Rom to Cubic Bezier conversion)
 */
function buildSmoothBezierPath(coords: Array<{ x: number; y: number }>): string {
  if (coords.length === 0) return '';
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

  let path = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? i : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

/**
 * Smooth easeOutExpo requestAnimationFrame count-up hook (1200ms)
 */
function useCountUp(target: number, durationMs = 1200, triggerKey = 0): number {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    let rafId = 0;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(target * eased);
      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    setValue(0);
    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [target, durationMs, triggerKey]);

  return value;
}

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('vi');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isDark = theme === 'dark';
  const [activeNav, setActiveNav] = useState<string>('#overview');
  const [overviewAnimKey, setOverviewAnimKey] = useState<number>(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [heroSelectedPlayer, setHeroSelectedPlayer] = useState<PlayerProfile | null>(null);
  const [curveTab, setCurveTab] = useState<CurveTab>('xg_trajectory');
  const [cmdOpen, setCmdOpen] = useState<boolean>(false);
  const [cmdQuery, setCmdQuery] = useState<string>('');
  const [squadLabCommand, setSquadLabCommand] = useState<SquadLabCommand | null>(null);

  const uclCount = useCountUp(15, 1200, overviewAnimKey);
  const bmvOutputCount = useCountUp(
    dataset.trident2026Analytics.combinedGaPer90,
    1200,
    overviewAnimKey
  );
  const clasicoBarcaScore = useCountUp(1, 900, overviewAnimKey);
  const clasicoRealScore = useCountUp(2, 1200, overviewAnimKey);
  const remontadaPctCount = useCountUp(
    dataset.remontadaAnalytics.lateWindowSharePct,
    1200,
    overviewAnimKey
  );

  const scrollToSection = (selector: string, navHref?: string) => {
    if (navHref) {
      setActiveNav(navHref);
    }
    setMobileSidebarOpen(false);
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const triggerSquadLabMode = (
    mode: SquadLabCommand['mode'],
    scrollTarget: string,
    navHref: string
  ) => {
    setActiveNav(navHref);
    setMobileSidebarOpen(false);
    setSquadLabCommand({ mode, seq: Date.now() });
    setTimeout(() => {
      const target = document.querySelector(scrollTarget);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  // Sync Dark Mode (#0A0A0A) / Light Mode (#F8FAFC) with documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light-mode');
    } else {
      root.classList.remove('dark');
      root.classList.add('light-mode');
    }
  }, [theme]);

  // Global Keyboard Shortcut [⌘ K] / [Ctrl + K] for Search Palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCmdOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Scroll-Spy for the 6 Sidebar Menu Items
  useEffect(() => {
    const trackedAnchors = [
      { id: 'overview', nav: '#overview' },
      { id: 'museum', nav: '#museum' },
      { id: 'squad', nav: '#squad' },
      { id: 'player-stats', nav: '#player-stats' },
      { id: 'transfers', nav: '#transfers' },
      { id: 'simulator', nav: '#simulator' },
    ];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (let i = trackedAnchors.length - 1; i >= 0; i--) {
        const el = document.getElementById(trackedAnchors[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveNav(trackedAnchors[i].nav);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 6 Ember Minimalist Sidebar Navigation Items
  const navItems = [
    {
      href: '#overview',
      icon: Layers,
      labelVi: 'Tổng Quan',
      labelEn: 'Overview',
      badge: null,
    },
    {
      href: '#museum',
      icon: Trophy,
      labelVi: 'Bảo Tàng C1',
      labelEn: 'Match Logs',
      badge: '15',
    },
    {
      href: '#squad',
      icon: Users,
      labelVi: 'Đội Hình 2026/27',
      labelEn: 'Squad',
      badge: '32',
    },
    {
      href: '#player-stats',
      icon: BarChart3,
      labelVi: 'Thống Kê Cầu Thủ',
      labelEn: 'Player Stats',
      badge: '74',
    },
    {
      href: '#transfers',
      icon: GitCommit,
      labelVi: 'Chuyển Nhượng & El Clásico',
      labelEn: 'Transfers',
      badge: '10',
    },
    {
      href: '#simulator',
      icon: Cpu,
      labelVi: 'Báo Cáo Chiến Thuật',
      labelEn: 'Tactical Reports',
      badge: null,
    },
  ];

  // Tracked Players Watchlist at Bottom of Sidebar with Glowing Dots & Monospace Rating
  const trackedWatchlist = useMemo(() => {
    const items = [
      {
        id: 'kylian-mbappe',
        shortName: 'K. Mbappé',
        pos: 'ST/LW',
        dotClass: 'bg-orange-500 glow-dot-ember',
        score: '9.48',
      },
      {
        id: 'vinicius-junior',
        shortName: 'Vinícius Jr',
        pos: 'LW/ST',
        dotClass: 'bg-emerald-400 glow-dot-emerald',
        score: '9.24',
      },
      {
        id: 'jude-bellingham',
        shortName: 'J. Bellingham',
        pos: 'AM/CM',
        dotClass: 'bg-sky-400 glow-dot-sky',
        score: '9.16',
      },
      {
        id: 'federico-valverde',
        shortName: 'F. Valverde (C)',
        pos: 'CM/RW',
        dotClass: 'bg-purple-400 glow-dot-violet',
        score: '8.92',
      },
      {
        id: 'yan-diomande',
        shortName: 'Yan Diomande',
        pos: 'RW/AM',
        dotClass: 'bg-emerald-400 glow-dot-emerald',
        score: '8.68',
      },
      {
        id: 'trent-alexander-arnold',
        shortName: 'Trent A-A',
        pos: 'RB/CM',
        dotClass: 'bg-amber-400 glow-dot-amber',
        score: '8.54',
      },
    ];
    return items.map((item) => ({
      ...item,
      profile: dataset.players.find((p) => p.id === item.id) ?? null,
    }));
  }, []);

  const featuredStars = useMemo(
    () =>
      ['kylian-mbappe', 'vinicius-junior', 'jude-bellingham', 'yan-diomande']
        .map((id) => dataset.players.find((p) => p.id === id))
        .filter((p): p is PlayerProfile => Boolean(p)),
    []
  );

  // 2024–2026/27 Strategic Transfers & Arrivals Cohort
  const strategicTransfers = useMemo(() => {
    const ids = [
      { id: 'kylian-mbappe', window: '07/2024', from: 'Paris Saint-Germain', fee: 'Free (Sign-on)', val: '€200M' },
      { id: 'endrick', window: '07/2024', from: 'Palmeiras', fee: '€47.5M', val: '€65M' },
      { id: 'trent-alexander-arnold', window: '06/2025', from: 'Liverpool FC', fee: 'Free Transfer', val: '€75M' },
      { id: 'dean-huijsen', window: '06/2025', from: 'Bournemouth', fee: '€58.0M', val: '€70M' },
      { id: 'alvaro-carreras', window: '07/2025', from: 'SL Benfica', fee: '€50.0M', val: '€60M' },
      { id: 'yan-diomande', window: '08/2026', from: 'RB Leipzig', fee: '€42.0M', val: '€55M' },
      { id: 'ibrahima-konate', window: '07/2026', from: 'Liverpool FC', fee: 'Free Transfer', val: '€65M' },
      { id: 'bernardo-silva', window: '07/2026', from: 'Manchester City', fee: 'Free Transfer', val: '€45M' },
      { id: 'marc-cucurella', window: '07/2026', from: 'Chelsea FC', fee: '€35.0M', val: '€40M' },
      { id: 'denzel-dumfries', window: '08/2026', from: 'Inter Milan', fee: '€28.0M', val: '€35M' },
    ];
    return ids
      .map((meta) => {
        const player = dataset.players.find((p) => p.id === meta.id);
        return player ? { ...meta, player } : null;
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, []);

  // Command Palette Search Results
  const searchResults = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();
    if (!q) return dataset.players.slice(0, 8);
    return dataset.players
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          String(p.shirtNumber).includes(q) ||
          p.specificPositions.join('/').toLowerCase().includes(q) ||
          p.nationality.en.toLowerCase().includes(q) ||
          p.nationality.vi.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [cmdQuery]);

  // Smooth Curve Geometry Calculation
  const activeCurve = CURVE_DATASETS[curveTab];
  const chartW = 720;
  const chartH = 230;
  const padL = 44;
  const padR = 24;
  const padT = 24;
  const padB = 34;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const allCurveVals = activeCurve.points.flatMap((pt) => [pt.primary, pt.secondary]);
  const minCurveVal = Math.min(...allCurveVals) * 0.85;
  const maxCurveVal = Math.max(...allCurveVals) * 1.08;

  const primaryCoords = activeCurve.points.map((pt, idx) => {
    const x =
      padL +
      (idx / Math.max(1, activeCurve.points.length - 1)) * innerW;
    const y =
      padT +
      innerH -
      ((pt.primary - minCurveVal) / Math.max(1, maxCurveVal - minCurveVal)) * innerH;
    return { x, y, pt };
  });

  const secondaryCoords = activeCurve.points.map((pt, idx) => {
    const x =
      padL +
      (idx / Math.max(1, activeCurve.points.length - 1)) * innerW;
    const y =
      padT +
      innerH -
      ((pt.secondary - minCurveVal) / Math.max(1, maxCurveVal - minCurveVal)) * innerH;
    return { x, y, pt };
  });

  const primaryBezier = buildSmoothBezierPath(primaryCoords);
  const secondaryBezier = buildSmoothBezierPath(secondaryCoords);
  const primaryAreaPath =
    primaryCoords.length > 1
      ? `${primaryBezier} L ${primaryCoords[primaryCoords.length - 1].x.toFixed(1)} ${(padT + innerH).toFixed(1)} L ${primaryCoords[0].x.toFixed(1)} ${(padT + innerH).toFixed(1)} Z`
      : '';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#overview') {
      setOverviewAnimKey((k) => k + 1);
    }
    if (href === '#squad') {
      triggerSquadLabMode('squad_2026_27', '#squad', '#squad');
      return;
    }
    if (href === '#player-stats') {
      triggerSquadLabMode('all', '#player-stats', '#player-stats');
      return;
    }
    scrollToSection(href, href);
  };

  return (
    <div
      className={`min-h-screen font-sans flex transition-colors duration-200 ${
        isDark ? 'bg-[#0A0A0A] text-[#EDEDED]' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* MOBILE SIDEBAR BUTTON */}
      <button
        onClick={() => setMobileSidebarOpen((prev) => !prev)}
        className={`lg:hidden fixed top-3 left-3 z-50 px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-medium ${
          isDark
            ? 'bg-[#121212] border-white/[0.07] text-zinc-200'
            : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}
        aria-label="Toggle Navigation"
      >
        {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        <span>Menu</span>
      </button>

      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/80"
        />
      )}

      {/* ==========================================================================
         LEFT SIDEBAR (#0D0D0D DARK / #FFFFFF LIGHT, 1PX BORDER)
         ========================================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 border-r flex flex-col justify-between transition-all duration-200 select-none ${
          isDark ? 'bg-[#0D0D0D] border-white/[0.07]' : 'bg-white border-slate-200 shadow-sm'
        } ${sidebarCollapsed ? 'w-[72px]' : 'w-[272px]'} ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP SECTION: MINIMALIST RM LOGO + "HalaMadrid" + COLLAPSE BUTTON + SEARCH */}
        <div>
          <div className="h-14 px-3.5 border-b border-white/[0.07] flex items-center justify-between gap-2">
            <a
              href="#overview"
              onClick={(e) => handleNavClick(e, '#overview')}
              className="flex items-center gap-2.5 min-w-0"
            >
              <div className="w-7 h-7 rounded-lg bg-[#121212] border border-white/[0.07] flex items-center justify-center shrink-0">
                <span className="font-mono text-[11px] font-bold tracking-tighter text-white">
                  RM
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[14px] font-semibold tracking-tight text-white truncate">
                    HalaMadrid
                  </span>
                </div>
              )}
            </a>

            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="hidden lg:flex w-7 h-7 rounded-lg hover:bg-white/[0.07] items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle Sidebar Width"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* SEARCH BAR (WITHOUT CRAMPED ⌘K BADGE) */}
          <div className="p-3">
            <button
              onClick={() => setCmdOpen(true)}
              className={`w-full bg-[#121212] hover:bg-white/[0.04] border border-white/[0.07] rounded-xl text-xs text-zinc-400 transition-colors flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5' : 'justify-start px-3 py-2'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">
                    {lang === 'vi' ? 'Tìm cầu thủ, trận đấu...' : 'Search players, logs...'}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* NAVIGATION MENU */}
          <nav className="px-3 space-y-1">
            {!sidebarCollapsed && (
              <div className="px-2.5 pt-1 pb-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                {lang === 'vi' ? 'PHÂN HỆ CHỨC NĂNG' : 'WORKSPACE'}
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  title={lang === 'vi' ? item.labelVi : item.labelEn}
                  className={`w-full rounded-xl text-[13px] font-medium transition-colors flex items-center ${
                    sidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-white/[0.07] text-white border border-white/[0.07]'
                      : 'text-zinc-400 border border-transparent hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-orange-400' : 'text-zinc-500'
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate">
                        {lang === 'vi' ? item.labelVi : item.labelEn}
                      </span>
                    )}
                  </span>
                  {!sidebarCollapsed && item.badge && (
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#121212] border border-white/[0.07] text-zinc-300">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION: TRACKED PLAYERS / POSITIONS WITH GLOWING DOTS & MONOSPACE RATINGS */}
        <div className="border-t border-white/[0.07] p-3 space-y-3">
          {!sidebarCollapsed ? (
            <div>
              <div className="px-2 pb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                <span>{lang === 'vi' ? 'THEO DÕI CẦU THỦ' : 'WATCHED PLAYERS'}</span>
                <span>IDX</span>
              </div>
              <div className="space-y-1">
                {trackedWatchlist.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => w.profile && setHeroSelectedPlayer(w.profile)}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/[0.07] border border-transparent hover:border-white/[0.07] transition-colors flex items-center justify-between gap-2 text-left group"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${w.dotClass}`} />
                      <span className="text-xs font-medium text-zinc-300 group-hover:text-white truncate">
                        {w.shortName}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                        {w.pos}
                      </span>
                    </span>
                    <span className="font-mono text-xs font-semibold text-zinc-200 shrink-0">
                      {w.score}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 py-1">
              {trackedWatchlist.slice(0, 4).map((w) => (
                <button
                  key={w.id}
                  onClick={() => w.profile && setHeroSelectedPlayer(w.profile)}
                  title={`${w.shortName} (${w.pos}) — ${w.score}`}
                  className="w-8 h-8 rounded-xl bg-[#121212] border border-white/[0.07] flex items-center justify-center hover:border-white/20"
                >
                  <span className={`w-2 h-2 rounded-full ${w.dotClass}`} />
                </button>
              ))}
            </div>
          )}

          {/* Minimalist Theme & Language Toggle Footer Bar */}
          <div
            className={`pt-2 border-t border-white/[0.07] flex items-center ${
              sidebarCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between gap-2'
            }`}
          >
            <button
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              title={
                isDark
                  ? lang === 'vi'
                    ? 'Chuyển sang Giao diện Sáng'
                    : 'Switch to Light Mode'
                  : lang === 'vi'
                    ? 'Chuyển sang Giao diện Tối'
                    : 'Switch to Dark Mode'
              }
              aria-label="Toggle Theme"
              className={`w-8 h-7 rounded-lg bg-[#141414] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.06] transition-colors shrink-0 ${
                isDark ? 'text-neutral-300' : 'text-slate-700'
              }`}
            >
              {isDark ? (
                <Moon className="w-3.5 h-3.5" strokeWidth={1.75} />
              ) : (
                <Sun className="w-3.5 h-3.5" strokeWidth={1.75} />
              )}
            </button>

            <button
              onClick={() => setLang((prev) => (prev === 'vi' ? 'en' : 'vi'))}
              className="h-7 px-2.5 rounded-lg bg-[#141414] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.06] font-mono text-[11px] font-medium text-neutral-300 transition-colors shrink-0"
            >
              {lang === 'vi' ? 'VN' : 'EN'}
            </button>
          </div>
        </div>
      </aside>

      {/* ==========================================================================
         MAIN CONTENT AREA (#0A0A0A, BENTO STAT CARDS #121212, SMOOTH BEZIER CURVES)
         ========================================================================== */}
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-200 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[272px]'
        }`}
      >
        {/* TOP MINIMALIST TELEMETRY BAR */}
        <header
          className={`sticky top-0 z-30 h-14 backdrop-blur-md border-b px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors duration-200 ${
            isDark ? 'bg-[#0A0A0A]/90 border-white/[0.07]' : 'bg-white/90 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs text-zinc-400 pl-20 lg:pl-0">
            <span className="font-medium text-zinc-200">HalaMadrid</span>
            <span className="text-zinc-600">/</span>
            <span className="font-mono text-zinc-400">
              {lang === 'vi'
                ? (navItems.find((n) => n.href === activeNav)?.labelVi ?? 'Tổng Quan')
                : (navItems.find((n) => n.href === activeNav)?.labelEn ?? 'Overview')}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-md bg-[#121212] border border-white/[0.07] font-mono text-[11px] text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 glow-dot-ember" />
              <span>{lang === 'vi' ? 'DỮ LIỆU 1902–2026/27' : '1902–2026/27 DATASET'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="#player-stats"
              onClick={(e) => handleNavClick(e, '#player-stats')}
              className="px-3 py-1.5 rounded-xl bg-[#121212] hover:bg-white/[0.07] border border-white/[0.07] font-mono text-xs text-zinc-200 flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-orange-400" />
              <span>{lang === 'vi' ? '74 Hồ sơ' : '74 Profiles'}</span>
            </a>
          </div>
        </header>

        {/* ==========================================================================
           BENTO GRID EXECUTIVE OVERVIEW (#overview)
           ========================================================================== */}
        <section
          id="overview"
          className="pt-8 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-5"
        >
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-zinc-400 mb-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 shadow-[0_0_10px_#f97316]"></span>
                </span>
                <span>REAL MADRID QUANTITATIVE INTELLIGENCE • 1902–2026/27</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {lang === 'vi'
                  ? 'Bách Khoa Toàn Thư & Phân Tích Dữ Liệu Real Madrid'
                  : 'Real Madrid Historical Archive & Quantitative Data Lab'}
              </h1>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 shrink-0">
              <span className="px-2.5 py-1 rounded-xl bg-[#121212] border border-white/[0.07] text-zinc-300 whitespace-nowrap">
                N = 74 Players
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#121212] border border-white/[0.07] text-emerald-400 whitespace-nowrap hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300">
                El Clásico 26/10/2026: 1–2
              </span>
            </div>
          </div>

          {/* ROW 1: 4 BENTO KPI STAT CARDS (#121212, border-white/[0.07], rounded-xl, JetBrains Mono, Motion & Spotlight) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Bento KPI 1: 15 UCL Titles -> Scrolls to #museum */}
            <div
              onClick={() => scrollToSection('#museum', '#museum')}
              style={{ animationDelay: '0ms' }}
              className="animate-bento-entrance group relative overflow-hidden bg-[#121212] border border-white/[0.07] hover:border-orange-500/40 hover:shadow-[0_8px_30px_-10px_rgba(249,115,22,0.2)] rounded-xl p-5 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity"
            >
              <div className="text-xs text-neutral-400 whitespace-nowrap group-hover:text-zinc-200 transition-colors">
                {lang === 'vi' ? 'Kỷ lục Cúp C1 Châu Âu' : 'UEFA Champions League'}
              </div>
              <div className="my-3 flex items-baseline justify-between">
                <div className="font-mono text-3xl font-bold text-white tracking-tight">
                  {Math.round(uclCount)}
                </div>
                <svg
                  key={`spark-1-${overviewAnimKey}`}
                  viewBox="0 0 90 28"
                  className="w-24 h-7 overflow-visible shrink-0 group-hover:scale-105 transition-transform duration-300"
                >
                  <defs>
                    <linearGradient id="sparkGradOrange" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 2 24 C 18 22, 32 18, 46 13 C 60 8, 74 5, 88 2 L 88 28 L 2 28 Z"
                    fill="url(#sparkGradOrange)"
                  />
                  <path
                    d="M 2 24 C 18 22, 32 18, 46 13 C 60 8, 74 5, 88 2"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-sparkline-draw"
                  />
                  <circle
                    cx="88"
                    cy="2"
                    r="5.5"
                    fill="#f97316"
                    className="animate-ping opacity-60"
                    style={{ transformOrigin: '88px 2px' }}
                  />
                  <circle cx="88" cy="2" r="3" fill="#f97316" />
                </svg>
              </div>
              <div className="font-mono text-[10.5px] xl:text-[11px] text-zinc-500 flex items-center justify-between gap-2 whitespace-nowrap">
                <span>La Decimoquinta (2024)</span>
                <span className="text-zinc-300">36 La Liga</span>
              </div>
            </div>

            {/* Bento KPI 2: BMV Trident Output -> Scrolls to #bmv-spotlight & filters #10, #7, #5 */}
            <div
              onClick={() => triggerSquadLabMode('bmv_trio', '#bmv-spotlight', '#squad')}
              style={{ animationDelay: '75ms' }}
              className="animate-bento-entrance group relative overflow-hidden bg-[#121212] border border-white/[0.07] hover:border-emerald-500/40 hover:shadow-[0_8px_30px_-10px_rgba(16,185,129,0.2)] rounded-xl p-5 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity"
            >
              <div className="text-xs text-neutral-400 whitespace-nowrap group-hover:text-zinc-200 transition-colors">
                {lang === 'vi' ? 'Hiệu suất Tam Tấu BMV' : 'BMV Trident Output'}
              </div>
              <div className="my-3 flex items-baseline justify-between">
                <div className="whitespace-nowrap">
                  <span className="font-mono text-3xl font-bold text-white tracking-tight">
                    {bmvOutputCount.toFixed(2)}
                  </span>
                  <span className="font-mono text-xs text-zinc-400 ml-1.5">G+A/90</span>
                </div>
                <svg
                  key={`spark-2-${overviewAnimKey}`}
                  viewBox="0 0 90 28"
                  className="w-24 h-7 overflow-visible shrink-0 group-hover:scale-105 transition-transform duration-300"
                >
                  <defs>
                    <linearGradient id="sparkGradEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 2 22 C 20 20, 35 12, 52 10 C 68 8, 78 4, 88 3 L 88 28 L 2 28 Z"
                    fill="url(#sparkGradEmerald)"
                  />
                  <path
                    d="M 2 22 C 20 20, 35 12, 52 10 C 68 8, 78 4, 88 3"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-sparkline-draw"
                  />
                  <circle
                    cx="88"
                    cy="3"
                    r="5.5"
                    fill="#10b981"
                    className="animate-ping opacity-60"
                    style={{ transformOrigin: '88px 3px' }}
                  />
                  <circle cx="88" cy="3" r="3" fill="#10b981" />
                </svg>
              </div>
              <div className="font-mono text-[10.5px] xl:text-[11px] text-zinc-500 flex items-center justify-between gap-2 whitespace-nowrap">
                <span>Mbappé 100G • Vini 118G</span>
                <span className="text-zinc-300">Jude 49G</span>
              </div>
            </div>

            {/* Bento KPI 3: Latest El Clásico 1-2 -> Scrolls to #clasico */}
            <div
              onClick={() => scrollToSection('#clasico')}
              style={{ animationDelay: '150ms' }}
              className="animate-bento-entrance group relative overflow-hidden bg-[#121212] border border-white/[0.07] hover:border-emerald-500/40 hover:shadow-[0_8px_30px_-10px_rgba(16,185,129,0.2)] rounded-xl p-5 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity"
            >
              <div className="text-xs text-neutral-400 whitespace-nowrap group-hover:text-zinc-200 transition-colors">
                {lang === 'vi' ? 'El Clásico Gần Nhất' : 'Latest El Clásico'}
              </div>
              <div className="my-3 flex items-baseline justify-between whitespace-nowrap">
                <div
                  key={`score-flip-${overviewAnimKey}`}
                  className="font-mono text-3xl font-bold text-white tracking-tight animate-score-flip"
                >
                  {Math.round(clasicoBarcaScore)} – {Math.round(clasicoRealScore)}
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span>Camp Nou (A)</span>
                </span>
              </div>
              <div className="font-mono text-[10.5px] xl:text-[11px] text-zinc-500 flex items-center justify-between gap-2 whitespace-nowrap">
                <span>Mbappé 41&apos;, 87&apos; (100th G)</span>
                <span className="text-zinc-300">Camavinga 87&apos; A</span>
              </div>
            </div>

            {/* Bento KPI 4: Monte Carlo Win Prob / DNA Remontada -> Scrolls to #simulator */}
            <div
              onClick={() => scrollToSection('#simulator', '#simulator')}
              style={{ animationDelay: '225ms' }}
              className="animate-bento-entrance group relative overflow-hidden bg-[#121212] border border-white/[0.07] hover:border-purple-500/40 hover:shadow-[0_8px_30px_-10px_rgba(168,85,247,0.2)] rounded-xl p-5 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity"
            >
              <div className="text-xs text-neutral-400 whitespace-nowrap group-hover:text-zinc-200 transition-colors">
                {lang === 'vi' ? "DNA Remontada (76'–90+')" : "DNA Remontada (76'–90+')"}
              </div>
              <div className="my-3 flex items-baseline justify-between">
                <div className="font-mono text-3xl font-bold text-white tracking-tight">
                  {remontadaPctCount.toFixed(1)}%
                </div>
                <svg
                  key={`spark-4-${overviewAnimKey}`}
                  viewBox="0 0 90 28"
                  className="w-24 h-7 overflow-visible shrink-0 group-hover:scale-105 transition-transform duration-300"
                >
                  <defs>
                    <linearGradient id="sparkGradPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 2 20 C 20 19, 34 15, 50 9 C 66 4, 76 5, 88 2 L 88 28 L 2 28 Z"
                    fill="url(#sparkGradPurple)"
                  />
                  <path
                    d="M 2 20 C 20 19, 34 15, 50 9 C 66 4, 76 5, 88 2"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-sparkline-draw"
                  />
                  <circle
                    cx="88"
                    cy="2"
                    r="5.5"
                    fill="#a855f7"
                    className="animate-ping opacity-60"
                    style={{ transformOrigin: '88px 2px' }}
                  />
                  <circle cx="88" cy="2" r="3" fill="#a855f7" />
                </svg>
              </div>
              <div className="font-mono text-[10.5px] xl:text-[11px] text-zinc-500 flex items-center justify-between gap-2 whitespace-nowrap">
                <span>
                  χ² = {dataset.remontadaAnalytics.chiSquareStat.toFixed(2)} (p &lt; 0.001)
                </span>
                <span className="text-zinc-300">CR7: 450G</span>
              </div>
            </div>
          </div>

          {/* ROW 2: BENTO SMOOTH BEZIER CURVE ANALYTICS (8 COL) + FEATURED QUARTET BENTO LIST (4 COL) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 8-Col Bento Card: Smooth Cubic-Bezier Curve Chart */}
            <div className="lg:col-span-8 bg-[#121212] border border-white/[0.07] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
                <div>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-orange-400" />
                    <h2 className="text-sm sm:text-base font-semibold text-white">
                      {lang === 'vi' ? activeCurve.titleVi : activeCurve.titleEn}
                    </h2>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-400 mt-1">
                    {activeCurve.deltaBadge}
                  </div>
                </div>

                {/* Curve Mode Switcher */}
                <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-white/[0.07] self-start">
                  {(
                    [
                      { id: 'xg_trajectory', label: 'Goals vs xG' },
                      { id: 'remontada_curve', label: 'Remontada 90+’' },
                      { id: 'trident_velocity', label: 'Velocity Curve' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setCurveTab(t.id)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors whitespace-nowrap ${
                        curveTab === t.id
                          ? 'bg-white/[0.08] text-white font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smooth Cubic-Bezier SVG Canvas */}
              <div className="my-4">
                <svg
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  className="w-full h-auto overflow-visible select-none"
                >
                  <defs>
                    <linearGradient id="emberSmoothFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Hairline Grid */}
                  {[0, 0.25, 0.5, 0.75, 1].map((step) => {
                    const y = padT + step * innerH;
                    const val = maxCurveVal - step * (maxCurveVal - minCurveVal);
                    return (
                      <g key={step}>
                        <line
                          x1={padL}
                          y1={y}
                          x2={chartW - padR}
                          y2={y}
                          stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}
                          strokeWidth="1"
                        />
                        <text
                          x={padL - 8}
                          y={y + 3}
                          textAnchor="end"
                          fill={isDark ? '#71717a' : '#64748b'}
                          fontSize="10"
                          className="font-mono"
                        >
                          {val.toFixed(0)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area under Primary Smooth Bezier Curve */}
                  {primaryAreaPath && <path d={primaryAreaPath} fill="url(#emberSmoothFill)" />}

                  {/* Secondary Smooth Bezier Curve (Dashed Baseline / Expected) */}
                  <path
                    d={secondaryBezier}
                    fill="none"
                    stroke={isDark ? '#71717a' : '#94a3b8'}
                    strokeWidth="1.75"
                    strokeDasharray="4 4"
                  />

                  {/* Primary Smooth Bezier Curve (Ember Orange) */}
                  <path
                    d={primaryBezier}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Data Nodes & Monospace Value Callouts */}
                  {primaryCoords.map((c, idx) => {
                    const sec = secondaryCoords[idx];
                    return (
                      <g key={c.pt.label}>
                        {/* Vertical guide on hover/node */}
                        <line
                          x1={c.x}
                          y1={c.y}
                          x2={c.x}
                          y2={padT + innerH}
                          stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)'}
                          strokeWidth="1"
                        />
                        <circle
                          cx={sec.x}
                          cy={sec.y}
                          r="3"
                          fill={isDark ? '#121212' : '#ffffff'}
                          stroke={isDark ? '#71717a' : '#64748b'}
                          strokeWidth="1.5"
                        />
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r="4"
                          fill={isDark ? '#0A0A0A' : '#ffffff'}
                          stroke="#f97316"
                          strokeWidth="2.2"
                        />
                        <text
                          x={c.x}
                          y={c.y - 10}
                          textAnchor="middle"
                          fill={isDark ? '#f4f4f5' : '#0f172a'}
                          fontSize="10"
                          fontWeight="600"
                          className="font-mono"
                        >
                          {c.pt.primary}
                          {activeCurve.unit === '%' ? '%' : ''}
                        </text>
                        <text
                          x={c.x}
                          y={padT + innerH + 18}
                          textAnchor="middle"
                          fill={isDark ? '#a1a1aa' : '#475569'}
                          fontSize="10"
                          className="font-mono"
                        >
                          {c.pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend Footer */}
              <div className="pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 glow-dot-ember" />
                    <span>
                      {lang === 'vi' ? activeCurve.primaryLabelVi : activeCurve.primaryLabelEn}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-zinc-500 inline-block" />
                    <span>
                      {lang === 'vi' ? activeCurve.secondaryLabelVi : activeCurve.secondaryLabelEn}
                    </span>
                  </span>
                </div>
                <span className="font-mono text-[11px] text-zinc-400">
                  Cubic-Bezier Spline • OLS Verified
                </span>
              </div>
            </div>

            {/* Right 4-Col Bento Card: 2026/27 Featured Spotlight Quartet */}
            <div className="lg:col-span-4 bg-[#121212] border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    {lang === 'vi' ? 'Trụ Cột Đội Hình 2026/27' : '2026/27 Core Spotlight'}
                  </h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {lang === 'vi'
                      ? 'Click vào cầu thủ để mở Hồ sơ 12 trường'
                      : 'Click any player to inspect full profile'}
                  </p>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.07] text-zinc-300">
                  BMV + #25
                </span>
              </div>

              <div className="my-3 space-y-2.5">
                {featuredStars.map((star) => (
                  <div
                    key={star.id}
                    onClick={() => setHeroSelectedPlayer(star)}
                    className="p-2.5 rounded-xl bg-[#0A0A0A] hover:bg-white/[0.05] border border-white/[0.07] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#121212] border border-white/[0.07] shrink-0">
                        <PlayerAvatar
                          src={star.imageUrl}
                          name={star.name}
                          shirtNumber={star.shirtNumber}
                          position={star.specificPositions.join('/')}
                          priority
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-orange-400">
                            #{star.shirtNumber}
                          </span>
                          <span className="text-xs font-semibold text-white truncate group-hover:text-orange-300 transition-colors">
                            {star.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                          <CountryFlag nationality={star.nationality} />
                          <span className="font-mono text-[10px] text-zinc-300">
                            {star.specificPositions.join('/')}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {star.stats.topSpeedKmh.toFixed(1)} km/h
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-white">
                        {star.stats.appearances}M • {star.stats.goals}G • {star.stats.assists}A
                      </div>
                      <div className="font-mono text-[10px] text-emerald-400 mt-0.5 flex items-center justify-end gap-0.5">
                        <span>{star.stats.gaPer90.toFixed(2)} G+A/90</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between text-xs">
                <a
                  href="#squad"
                  onClick={(e) => handleNavClick(e, '#squad')}
                  className="text-zinc-300 hover:text-white font-medium flex items-center gap-1"
                >
                  <span>{lang === 'vi' ? 'Xem toàn bộ 32 cầu thủ' : 'View all 32 squad players'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <span className="font-mono text-[11px] text-zinc-500">+ 42 Legends</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           MAIN INTERACTIVE ENCYCLOPEDIA & DATA SCIENCE SECTIONS
           ========================================================================== */}
        <main className="flex-1">
          {/* 1. Historical Timeline 1902–2026 & Bernabéu Evolution */}
          <TimelineSection eras={dataset.historicalEras} lang={lang} />

          {/* 2. Match Logs (15 UCL Finals & 2D Tactical Pitch Blueprints) */}
          <TrophyMuseumSection uclTitles={dataset.championsLeagueTitles} lang={lang} />

          {/* 3 & 4. Squad (32 + 42 Legends) & Player Stats (6-Axis Radar, EDA Lab & Matrix) */}
          <LegendsSquadLabSection
            players={dataset.players}
            tridentAnalytics={dataset.trident2026Analytics}
            lang={lang}
            externalCommand={squadLabCommand}
          />

          {/* 5. Transfers & Squad Acquisition Ledger (2024–2026/27) */}
          <section
            id="transfers"
            className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.07] scroll-mt-16"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-zinc-400 mb-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-orange-400" />
                  <span>TRANSFERS & SQUAD ACQUISITION LEDGER (2024–2026/27)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {lang === 'vi'
                    ? 'Hồ Sơ Chuyển Nhượng & Định Giá Đội Hình 2024–2026/27'
                    : 'Strategic Transfers & Valuation Matrix (2024–2026/27)'}
                </h2>
              </div>
              <div className="font-mono text-xs text-zinc-400 bg-[#121212] border border-white/[0.07] rounded-xl px-3.5 py-2">
                Total Tracked Arrivals: <span className="text-white font-bold">10 Players</span>
              </div>
            </div>

            <div className="bg-[#121212] border border-white/[0.07] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-[11px] font-mono uppercase text-zinc-400 bg-[#0D0D0D]">
                      <th className="py-3 px-4">{lang === 'vi' ? 'Cầu thủ' : 'Player'}</th>
                      <th className="py-3 px-3">{lang === 'vi' ? 'Vị trí' : 'Pos'}</th>
                      <th className="py-3 px-3">{lang === 'vi' ? 'Kỳ CN' : 'Window'}</th>
                      <th className="py-3 px-3">{lang === 'vi' ? 'CLB Cũ' : 'Previous Club'}</th>
                      <th className="py-3 px-3">{lang === 'vi' ? 'Hình thức / Phí' : 'Fee / Type'}</th>
                      <th className="py-3 px-3">{lang === 'vi' ? 'Định giá' : 'Market Val'}</th>
                      <th className="py-3 px-3 text-right">
                        {lang === 'vi' ? 'Thống kê RM (Tr/B/KT/Cúp)' : 'RM Stats (M/G/A/T)'}
                      </th>
                      <th className="py-3 px-4 text-right">G+A/90</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.07]">
                    {strategicTransfers.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setHeroSelectedPlayer(item.player)}
                        className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-white flex items-center gap-2.5 whitespace-nowrap">
                          <span className="font-mono text-xs text-orange-400 w-7">
                            #{item.player.shirtNumber}
                          </span>
                          <CountryFlag nationality={item.player.nationality} />
                          <span className="font-semibold">{item.player.name}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-zinc-300 whitespace-nowrap">
                          {item.player.specificPositions.join('/')}
                        </td>
                        <td className="py-3 px-3 font-mono text-zinc-400 whitespace-nowrap">
                          {item.window}
                        </td>
                        <td className="py-3 px-3 text-zinc-300 whitespace-nowrap">{item.from}</td>
                        <td className="py-3 px-3 font-mono text-zinc-300 whitespace-nowrap">
                          {item.fee}
                        </td>
                        <td className="py-3 px-3 font-mono text-emerald-400 font-semibold whitespace-nowrap">
                          {item.val}
                        </td>
                        <td className="py-3 px-3 font-mono text-white text-right whitespace-nowrap">
                          {item.player.stats.appearances}M • {item.player.stats.goals}G •{' '}
                          {item.player.stats.assists}A • {item.player.stats.trophies}T
                        </td>
                        <td className="py-3 px-4 font-mono text-orange-400 font-semibold text-right whitespace-nowrap">
                          {item.player.stats.gaPer90.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* El Clásico & Stoppage-Time Remontada Analytics */}
          <ClasicoRemontadaSection
            clasicoHistory={dataset.elClasicoHistory}
            remontadaAnalytics={dataset.remontadaAnalytics}
            headToHead={dataset.metadata.elClasicoHeadToHead}
            lang={lang}
          />

          {/* 6. Tactical Reports & 10,000-Match Monte Carlo Simulator */}
          <TacticalMonteCarloSection
            players={dataset.players}
            monteCarlo={dataset.monteCarloSimulation}
            lang={lang}
          />

          {/* Club Institutional Culture & Leadership */}
          <Madridista101Section leaders={dataset.clubLeaders} lang={lang} />
        </main>

        {/* 2-COLUMN PLAYER PROFILE MODAL */}
        {heroSelectedPlayer && (
          <PlayerWalkoutModal
            player={heroSelectedPlayer}
            lang={lang}
            onClose={() => setHeroSelectedPlayer(null)}
          />
        )}

        {/* COMMAND PALETTE MODAL [⌘ K] */}
        {cmdOpen && (
          <div
            onClick={() => setCmdOpen(false)}
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#121212] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/[0.07] flex items-center gap-3">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={cmdQuery}
                  onChange={(e) => setCmdQuery(e.target.value)}
                  placeholder={
                    lang === 'vi'
                      ? 'Nhập tên cầu thủ, số áo (#10, #7, #5, #12...) hoặc vị trí...'
                      : 'Search player name, shirt number (#10, #7, #5...), or position...'
                  }
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
                <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0A0A0A] border border-white/[0.07] text-zinc-400">
                  ESC
                </kbd>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setHeroSelectedPlayer(p);
                      setCmdOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.07] flex items-center justify-between gap-3 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-bold text-orange-400 w-7">
                        #{p.shirtNumber}
                      </span>
                      <CountryFlag nationality={p.nationality} />
                      <span className="text-xs font-semibold text-white truncate">{p.name}</span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {p.specificPositions.join('/')}
                      </span>
                    </span>
                    <span className="font-mono text-xs text-zinc-300 shrink-0">
                      {p.stats.appearances}M • {p.stats.goals}G • {p.stats.assists}A
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MINIMALIST EMBER FOOTER */}
        <footer className="bg-[#0D0D0D] border-t border-white/[0.07] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#121212] border border-white/[0.07] flex items-center justify-center font-mono text-[10px] font-bold text-white">
                RM
              </div>
              <span className="font-medium text-zinc-300">
                HalaMadrid — All-Time Real Madrid Intelligence (1902–2026/27)
              </span>
            </div>
            <div className="font-mono text-[11px] text-zinc-500">
              Ember Minimalist Dark UI • Inter & JetBrains Mono • Synced 27/10/2026
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
