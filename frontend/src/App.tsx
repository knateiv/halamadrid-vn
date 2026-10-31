import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  BarChart3,
  Clock,
  Cpu,
  Crown,
  Flame,
  GitCommit,
  Menu,
  Moon,
  Search,
  SlidersHorizontal,
  Sparkles,
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
import { BernabeuHero3DCanvas } from './components/BernabeuHero3DCanvas';
import { OptaTacticalPitchLab } from './components/OptaTacticalPitchLab';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [heroSelectedPlayer, setHeroSelectedPlayer] = useState<PlayerProfile | null>(null);
  const [curveTab, setCurveTab] = useState<CurveTab>('xg_trajectory');
  const [cmdOpen, setCmdOpen] = useState<boolean>(false);
  const [cmdQuery, setCmdQuery] = useState<string>('');
  const [squadLabCommand, setSquadLabCommand] = useState<SquadLabCommand | null>(null);

  const appRootRef = useRef<HTMLDivElement | null>(null);

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

  // GSAP Hero & Editorial Showcase Entrance Orchestration
  useGSAP(
    () => {
      gsap.fromTo(
        '.gsap-hero-reveal',
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    },
    { scope: appRootRef, dependencies: [overviewAnimKey] }
  );

  const scrollToSection = (selector: string, navHref?: string) => {
    if (navHref) {
      setActiveNav(navHref);
    }
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
    setSquadLabCommand({ mode, seq: Date.now() });
    setTimeout(() => {
      const target = document.querySelector(scrollTarget);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  // Sync Midnight Royal Navy (#050914) / Daylight White (#F8FAFC) with documentElement
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

  // Scroll-Spy for the Top Floating Glassmorphic Megamenu
  useEffect(() => {
    const trackedAnchors = [
      { id: 'overview', nav: '#overview' },
      { id: 'timeline', nav: '#timeline' },
      { id: 'museum', nav: '#museum' },
      { id: 'squad', nav: '#squad' },
      { id: 'player-stats', nav: '#player-stats' },
      { id: 'clasico', nav: '#clasico' },
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

  // Top Floating Glassmorphic Megamenu Navigation Items
  const megamenuItems = [
    {
      href: '#overview',
      icon: BarChart3,
      labelVi: 'Phân Tích Chiến Thuật xG',
      labelEn: 'Opta xG & Tactical Lab',
      badge: 'xG',
    },
    {
      href: '#timeline',
      icon: Clock,
      labelVi: 'Kỷ Nguyên',
      labelEn: 'Dynasty Eras',
      badge: '1902–26',
    },
    {
      href: '#museum',
      icon: Trophy,
      labelVi: 'Phòng Truyền Thống 15 C1',
      labelEn: '15 UCL Trophy Room',
      badge: '15',
    },
    {
      href: '#squad',
      icon: Users,
      labelVi: '74 Huyền Thoại & Cầu Thủ',
      labelEn: '74 Legends & Squad',
      badge: '74',
    },
    {
      href: '#clasico',
      icon: Flame,
      labelVi: 'El Clásico',
      labelEn: 'El Clásico',
      badge: '265',
    },
    {
      href: '#simulator',
      icon: Cpu,
      labelVi: 'Giả Lập Chiến Thuật',
      labelEn: 'Monte Carlo Sim',
      badge: null,
    },
  ];

  // Royal Watchlist Ribbon Profiles
  const trackedWatchlist = useMemo(() => {
    const items = [
      {
        id: 'kylian-mbappe',
        shortName: 'K. Mbappé',
        pos: 'ST/LW',
        dotClass: 'bg-[#D4AF37] glow-dot-gold',
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
    const x = padL + (idx / Math.max(1, activeCurve.points.length - 1)) * innerW;
    const y =
      padT +
      innerH -
      ((pt.primary - minCurveVal) / Math.max(1, maxCurveVal - minCurveVal)) * innerH;
    return { x, y, pt };
  });

  const secondaryCoords = activeCurve.points.map((pt, idx) => {
    const x = padL + (idx / Math.max(1, activeCurve.points.length - 1)) * innerW;
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
      triggerSquadLabMode('all', '#squad', '#squad');
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
      ref={appRootRef}
      className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#050914] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* ==========================================================================
         TOP FLOATING GLASSMORPHIC MEGAMENU (ROYAL BERNABÉU EDITORIAL BROADCAST BAR)
         ========================================================================== */}
      <header className="fixed top-3 inset-x-0 z-50 px-3 sm:px-6 lg:px-8 pointer-events-none">
        <div
          className={`pointer-events-auto max-w-7xl mx-auto rounded-2xl border backdrop-blur-xl px-3.5 sm:px-5 h-16 flex items-center justify-between gap-3 shadow-[0_20px_50px_rgba(2,6,23,0.85)] transition-all ${
            isDark
              ? 'bg-[#0B1224]/90 border-[#D4AF37]/30'
              : 'bg-white/95 border-[#D4AF37]/40 shadow-lg'
          }`}
        >
          {/* Left: Royal Madrid Crown Emblem & Editorial Brand */}
          <a
            href="#overview"
            onClick={(e) => handleNavClick(e, '#overview')}
            className="flex items-center gap-3 min-w-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5D061] via-[#D4AF37] to-[#9A7211] p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.35)] shrink-0">
              <div className="w-full h-full rounded-[11px] bg-[#050914] flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#F5D061] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-royal text-sm sm:text-base font-extrabold tracking-wider text-[#F8FAFC] truncate">
                  HALAMADRID
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/40 font-mono text-[10px] font-bold text-[#F5D061]">
                  OPTA × BERNABÉU
                </span>
              </div>
              <div className="font-mono text-[10px] text-slate-400 truncate">
                {lang === 'vi' ? 'TẠP CHÍ DỮ LIỆU • 1902–2026/27' : 'EDITORIAL DATA LAB • 1902–2026/27'}
              </div>
            </div>
          </a>

          {/* Center: Megamenu Broadcast Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#050914]/75 p-1.5 rounded-xl border border-[#D4AF37]/20">
            {megamenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#050914] font-bold shadow-[0_0_16px_rgba(212,175,55,0.35)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-[#050914]' : 'text-[#D4AF37]'
                    }`}
                  />
                  <span>{lang === 'vi' ? item.labelVi : item.labelEn}</span>
                  {item.badge && (
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-[#050914]/20 text-[#050914] font-extrabold'
                          : 'bg-[#0B1224] border border-[#D4AF37]/25 text-[#F5D061]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Quick Search, Theme & Language Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCmdOpen(true)}
              className="h-9 px-3 rounded-xl bg-[#050914]/85 hover:bg-[#101A33] border border-[#D4AF37]/30 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-2"
              title="Quick Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#F5D061]" />
              <span className="hidden md:inline">
                {lang === 'vi' ? '74 Hồ sơ' : '74 Profiles'}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0B1224] border border-[#D4AF37]/25 text-[#F5D061]">
                ⌘K
              </span>
            </button>

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
              className="w-9 h-9 rounded-xl bg-[#050914]/85 hover:bg-[#101A33] border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D061] transition-colors"
            >
              {isDark ? (
                <Moon className="w-4 h-4" strokeWidth={1.75} />
              ) : (
                <Sun className="w-4 h-4" strokeWidth={1.75} />
              )}
            </button>

            <button
              onClick={() => setLang((prev) => (prev === 'vi' ? 'en' : 'vi'))}
              className="h-9 px-2.5 rounded-xl bg-[#050914]/85 hover:bg-[#101A33] border border-[#D4AF37]/30 font-mono text-xs font-bold text-[#F5D061] transition-colors"
            >
              {lang === 'vi' ? 'VN' : 'EN'}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="xl:hidden w-9 h-9 rounded-xl bg-[#050914]/85 border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D061]"
              aria-label="Toggle Megamenu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Megamenu */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto xl:hidden max-w-7xl mx-auto mt-2 rounded-2xl bg-[#0B1224]/95 border border-[#D4AF37]/35 backdrop-blur-xl p-3 shadow-2xl grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {megamenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#050914] font-bold'
                      : 'text-slate-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{lang === 'vi' ? item.labelVi : item.labelEn}</span>
                  </span>
                  {item.badge && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#050914]/25">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </header>

      {/* ==========================================================================
         ROYAL BERNABÉU 3D HERO SHOWCASE & OPTA TACTICAL INTELLIGENCE (#overview)
         ========================================================================== */}
      <section
        id="overview"
        className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-6"
      >
        {/* 3D WebGL Santiago Bernabéu Hero Showcase Card */}
        <div className="gsap-hero-reveal relative rounded-3xl overflow-hidden border border-[#D4AF37]/35 bg-gradient-to-b from-[#0B1224]/95 via-[#070D1D]/95 to-[#050914]/95 p-6 sm:p-8 lg:p-10 shadow-[0_30px_80px_-20px_rgba(2,6,23,0.95)]">
          {/* Interactive Three.js 3D Stadium & 15-Star Crown Orbital Canvas */}
          <BernabeuHero3DCanvas />

          {/* Top Editorial Status Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#D4AF37]/20">
            <div className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-widest text-[#F5D061]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5D061] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37] shadow-[0_0_12px_#D4AF37]"></span>
              </span>
              <span>REAL MADRID QUANTITATIVE INTELLIGENCE • 1902–2026/27</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1 rounded-xl bg-[#050914]/85 border border-[#D4AF37]/30 text-[#F8FAFC]">
                N = 74 Players • DỮ LIỆU 1902–2026/27
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#050914]/85 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                El Clásico 26/10/2026: 1–2
              </span>
            </div>
          </div>

          {/* Center Editorial Showcase: La Decimoquinta (15 UCL) + Royal Headline */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 sm:py-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#F5D061] text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {lang === 'vi'
                    ? 'Ấn Phẩm Đặc Biệt • Santiago Bernabéu & Opta Analyst'
                    : 'Special Editorial • Santiago Bernabéu & Opta Analyst'}
                </span>
              </div>

              <h1 className="font-royal text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F8FAFC] leading-[1.12]">
                {lang === 'vi'
                  ? 'Bách Khoa Toàn Thư & Phân Tích Dữ Liệu Real Madrid'
                  : 'Real Madrid Historical Archive & Quantitative Data Lab'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {lang === 'vi'
                  ? 'Tôn vinh 15 chức vô địch UEFA Champions League (La Decimoquinta), hồ sơ định lượng 74 huyền thoại & cầu thủ mùa 2026/27, toàn bộ 265 trận El Clásico lịch sử và mô hình giả lập chiến thuật 10.000 trận.'
                  : 'Celebrating 15 UEFA Champions League crowns (La Decimoquinta), 74 player & legend quantitative profiles through 2026/27, all 265 official El Clásico matches, and 10,000-match Monte Carlo tactical simulations.'}
              </p>

              {/* Quick Editorial CTA Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => scrollToSection('#museum', '#museum')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#050914] font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>
                    {lang === 'vi'
                      ? 'Khám Phá 15 Chung Kết C1'
                      : 'Explore All 15 UCL Finals'}
                  </span>
                </button>
                <button
                  onClick={() => triggerSquadLabMode('squad_2026_27', '#squad', '#squad')}
                  className="px-4 py-2.5 rounded-xl bg-[#050914]/85 hover:bg-[#101A33] border border-[#D4AF37]/40 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-[#F5D061]" />
                  <span>
                    {lang === 'vi'
                      ? 'Đội Hình 2026/27 & 74 Hồ Sơ'
                      : '2026/27 Squad & 74 Profiles'}
                  </span>
                </button>
              </div>
            </div>

            {/* Right 4-Col: Monumental 15 UCL La Decimoquinta Emblem Box */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div
                onClick={() => scrollToSection('#museum', '#museum')}
                className="cursor-pointer group w-full max-w-xs rounded-2xl bg-[#050914]/85 border border-[#D4AF37]/45 p-5 text-center shadow-[0_0_40px_rgba(212,175,55,0.18)] hover:border-[#F5D061] transition-all"
              >
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#F5D061]">
                  UEFA CHAMPIONS LEAGUE DYNASTY
                </div>
                <div className="font-royal text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3B0] via-[#F5D061] to-[#D4AF37] my-1">
                  15
                </div>
                <div className="font-royal text-xs font-bold uppercase tracking-widest text-[#F8FAFC]">
                  LA DECIMOQUINTA (1956–2024)
                </div>
                <div className="mt-3 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between font-mono text-[11px] text-slate-300">
                  <span>100% Finals Won (1998–2024)</span>
                  <span className="text-[#F5D061] group-hover:translate-x-0.5 transition-transform">
                    36 La Liga →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Royal Watchlist Quick-Inspect Bar */}
          <div className="relative z-10 pt-4 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              {lang === 'vi' ? 'THEO DÕI CẦU THỦ TRỤ CỘT (OPTA IDX):' : 'TRACKED CORE PLAYERS (OPTA IDX):'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {trackedWatchlist.map((w) => (
                <button
                  key={w.id}
                  onClick={() => w.profile && setHeroSelectedPlayer(w.profile)}
                  className="px-2.5 py-1 rounded-xl bg-[#050914]/85 hover:bg-[#101A33] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all flex items-center gap-2 text-xs"
                >
                  <span className={`w-2 h-2 rounded-full ${w.dotClass}`} />
                  <span className="font-semibold text-[#F8FAFC]">{w.shortName}</span>
                  <span className="font-mono text-[10px] text-slate-400">{w.pos}</span>
                  <span className="font-mono text-[11px] font-bold text-[#F5D061]">{w.score}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 1: 4 ROYAL OPTA KPI STAT CARDS */}
        <div className="gsap-hero-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: 15 UCL Titles -> Scrolls to #museum */}
          <div
            onClick={() => scrollToSection('#museum', '#museum')}
            className="glass-royal group relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[#F5D061]">
              {lang === 'vi' ? 'Kỷ lục Cúp C1 Châu Âu' : 'UEFA Champions League'}
            </div>
            <div className="my-3 flex items-baseline justify-between">
              <div className="font-mono text-3xl font-bold text-[#F8FAFC] tracking-tight">
                {Math.round(uclCount)}
              </div>
              <svg
                key={`spark-1-${overviewAnimKey}`}
                viewBox="0 0 90 28"
                className="w-24 h-7 overflow-visible shrink-0 group-hover:scale-105 transition-transform duration-300"
              >
                <defs>
                  <linearGradient id="sparkGradGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 2 24 C 18 22, 32 18, 46 13 C 60 8, 74 5, 88 2 L 88 28 L 2 28 Z"
                  fill="url(#sparkGradGold)"
                />
                <path
                  d="M 2 24 C 18 22, 32 18, 46 13 C 60 8, 74 5, 88 2"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-sparkline-draw"
                />
                <circle cx="88" cy="2" r="3" fill="#F5D061" />
              </svg>
            </div>
            <div className="font-mono text-[10.5px] xl:text-[11px] text-slate-400 flex items-center justify-between gap-2 whitespace-nowrap">
              <span>La Decimoquinta (2024)</span>
              <span className="text-[#F5D061]">36 La Liga</span>
            </div>
          </div>

          {/* KPI 2: BMV Trident Output -> Scrolls to #bmv-spotlight */}
          <div
            onClick={() => triggerSquadLabMode('bmv_trio', '#bmv-spotlight', '#squad')}
            className="glass-royal group relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {lang === 'vi' ? 'Hiệu suất Tam Tấu BMV' : 'BMV Trident Output'}
            </div>
            <div className="my-3 flex items-baseline justify-between">
              <div className="whitespace-nowrap">
                <span className="font-mono text-3xl font-bold text-[#F8FAFC] tracking-tight">
                  {bmvOutputCount.toFixed(2)}
                </span>
                <span className="font-mono text-xs text-slate-400 ml-1.5">G+A/90</span>
              </div>
              <svg
                key={`spark-2-${overviewAnimKey}`}
                viewBox="0 0 90 28"
                className="w-24 h-7 overflow-visible shrink-0 group-hover:scale-105 transition-transform duration-300"
              >
                <defs>
                  <linearGradient id="sparkGradEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
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
                <circle cx="88" cy="3" r="3" fill="#10b981" />
              </svg>
            </div>
            <div className="font-mono text-[10.5px] xl:text-[11px] text-slate-400 flex items-center justify-between gap-2 whitespace-nowrap">
              <span>Mbappé 100G • Vini 118G</span>
              <span className="text-[#F8FAFC]">Jude 49G</span>
            </div>
          </div>

          {/* KPI 3: Latest El Clásico 1-2 -> Scrolls to #clasico */}
          <div
            onClick={() => scrollToSection('#clasico', '#clasico')}
            className="glass-royal group relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              {lang === 'vi' ? 'El Clásico Gần Nhất' : 'Latest El Clásico'}
            </div>
            <div className="my-3 flex items-baseline justify-between whitespace-nowrap">
              <div
                key={`score-flip-${overviewAnimKey}`}
                className="font-mono text-3xl font-bold text-[#F8FAFC] tracking-tight animate-score-flip"
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
            <div className="font-mono text-[10.5px] xl:text-[11px] text-slate-400 flex items-center justify-between gap-2 whitespace-nowrap">
              <span>Mbappé 41&apos;, 87&apos; (100th G)</span>
              <span className="text-[#F8FAFC]">Camavinga 87&apos; A</span>
            </div>
          </div>

          {/* KPI 4: DNA Remontada -> Scrolls to #simulator */}
          <div
            onClick={() => scrollToSection('#simulator', '#simulator')}
            className="glass-royal group relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              {lang === 'vi' ? "DNA Remontada (76'–90+')" : "DNA Remontada (76'–90+')"}
            </div>
            <div className="my-3 flex items-baseline justify-between">
              <div className="font-mono text-3xl font-bold text-[#F8FAFC] tracking-tight">
                {remontadaPctCount.toFixed(1)}%
              </div>
              <svg
                key={`spark-4-${overviewAnimKey}`}
                viewBox="0 0 90 28"
                className="w-24 h-7 overflow-visible shrink-0 group-hover:scale-105 transition-transform duration-300"
              >
                <defs>
                  <linearGradient id="sparkGradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.28" />
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
                <circle cx="88" cy="2" r="3" fill="#a855f7" />
              </svg>
            </div>
            <div className="font-mono text-[10.5px] xl:text-[11px] text-slate-400 flex items-center justify-between gap-2 whitespace-nowrap">
              <span>
                χ² = {dataset.remontadaAnalytics.chiSquareStat.toFixed(2)} (p &lt; 0.001)
              </span>
              <span className="text-[#F8FAFC]">CR7: 450G</span>
            </div>
          </div>
        </div>

        {/* ROW 2: INTERACTIVE 2D/3D OPTA TACTICAL PITCH, BMV SHOT MAP & 6-AXIS RADAR */}
        <OptaTacticalPitchLab
          players={dataset.players}
          lang={lang}
          onSelectPlayer={(p) => setHeroSelectedPlayer(p)}
        />

        {/* ROW 3: SMOOTH CUBIC-BEZIER XG TRAJECTORY (8 COL) + 2026/27 CORE SPOTLIGHT QUARTET (4 COL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 8-Col Card: Smooth Cubic-Bezier Curve Chart */}
          <div className="lg:col-span-8 glass-royal rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/20">
              <div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="font-royal text-sm sm:text-base font-bold text-[#F8FAFC]">
                    {lang === 'vi' ? activeCurve.titleVi : activeCurve.titleEn}
                  </h2>
                </div>
                <div className="font-mono text-[11px] text-[#F5D061] mt-1">
                  {activeCurve.deltaBadge}
                </div>
              </div>

              {/* Curve Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#050914] p-1 rounded-xl border border-[#D4AF37]/25 self-start">
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
                        ? 'bg-[#D4AF37] text-[#050914] font-bold'
                        : 'text-slate-400 hover:text-white'
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
                  <linearGradient id="royalGoldSmoothFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

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
                        stroke={isDark ? 'rgba(212,175,55,0.12)' : 'rgba(15,23,42,0.08)'}
                        strokeWidth="1"
                      />
                      <text
                        x={padL - 8}
                        y={y + 3}
                        textAnchor="end"
                        fill={isDark ? '#94a3b8' : '#64748b'}
                        fontSize="10"
                        className="font-mono"
                      >
                        {val.toFixed(0)}
                      </text>
                    </g>
                  );
                })}

                {primaryAreaPath && <path d={primaryAreaPath} fill="url(#royalGoldSmoothFill)" />}

                <path
                  d={secondaryBezier}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.75"
                  strokeDasharray="4 4"
                />

                <path
                  d={primaryBezier}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />

                {primaryCoords.map((c, idx) => {
                  const sec = secondaryCoords[idx];
                  return (
                    <g key={c.pt.label}>
                      <line
                        x1={c.x}
                        y1={c.y}
                        x2={c.x}
                        y2={padT + innerH}
                        stroke="rgba(212,175,55,0.12)"
                        strokeWidth="1"
                      />
                      <circle
                        cx={sec.x}
                        cy={sec.y}
                        r="3"
                        fill="#050914"
                        stroke="#38BDF8"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r="4"
                        fill="#050914"
                        stroke="#F5D061"
                        strokeWidth="2.2"
                      />
                      <text
                        x={c.x}
                        y={c.y - 10}
                        textAnchor="middle"
                        fill={isDark ? '#F8FAFC' : '#0f172a'}
                        fontSize="10"
                        fontWeight="700"
                        className="font-mono"
                      >
                        {c.pt.primary}
                        {activeCurve.unit === '%' ? '%' : ''}
                      </text>
                      <text
                        x={c.x}
                        y={padT + innerH + 18}
                        textAnchor="middle"
                        fill={isDark ? '#CBD5E1' : '#475569'}
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

            <div className="pt-3 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] glow-dot-gold" />
                  <span>
                    {lang === 'vi' ? activeCurve.primaryLabelVi : activeCurve.primaryLabelEn}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-sky-400 inline-block" />
                  <span>
                    {lang === 'vi' ? activeCurve.secondaryLabelVi : activeCurve.secondaryLabelEn}
                  </span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#F5D061]">
                Cubic-Bezier Spline • Opta Verified
              </span>
            </div>
          </div>

          {/* Right 4-Col Card: 2026/27 Featured Spotlight Quartet */}
          <div className="lg:col-span-4 glass-royal rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#D4AF37]/20">
              <div>
                <h2 className="font-royal text-sm font-bold text-[#F8FAFC]">
                  {lang === 'vi' ? 'Trụ Cột Đội Hình 2026/27' : '2026/27 Core Spotlight'}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'vi'
                    ? 'Click vào cầu thủ để mở Hồ sơ 12 trường'
                    : 'Click any player to inspect full profile'}
                </p>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5D061]">
                BMV + #25
              </span>
            </div>

            <div className="my-3 space-y-2.5">
              {featuredStars.map((star) => (
                <div
                  key={star.id}
                  onClick={() => setHeroSelectedPlayer(star)}
                  className="p-2.5 rounded-xl bg-[#050914]/85 hover:bg-[#101A33] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#0B1224] border border-[#D4AF37]/35 shrink-0">
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
                        <span className="font-mono text-xs font-bold text-[#F5D061]">
                          #{star.shirtNumber}
                        </span>
                        <span className="text-xs font-bold text-[#F8FAFC] truncate group-hover:text-[#F5D061] transition-colors">
                          {star.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <CountryFlag nationality={star.nationality} />
                        <span className="font-mono text-[10px] text-slate-300">
                          {star.specificPositions.join('/')}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="font-mono text-[10px] text-[#F5D061]">
                          {star.stats.topSpeedKmh.toFixed(1)} km/h
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold text-[#F8FAFC]">
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

            <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
              <a
                href="#squad"
                onClick={(e) => handleNavClick(e, '#squad')}
                className="text-[#F5D061] hover:text-white font-semibold flex items-center gap-1"
              >
                <span>{lang === 'vi' ? 'Xem toàn bộ 32 cầu thủ' : 'View all 32 squad players'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <span className="font-mono text-[11px] text-slate-400">+ 42 Legends</span>
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
          className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D4AF37]/20 scroll-mt-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#F5D061] mb-1.5">
                <GitCommit className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>TRANSFERS &amp; SQUAD ACQUISITION LEDGER (2024–2026/27)</span>
              </div>
              <h2 className="font-royal text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
                {lang === 'vi'
                  ? 'Hồ Sơ Chuyển Nhượng & Định Giá Đội Hình 2024–2026/27'
                  : 'Strategic Transfers & Valuation Matrix (2024–2026/27)'}
              </h2>
            </div>
            <div className="font-mono text-xs text-slate-300 glass-royal rounded-xl px-3.5 py-2">
              Total Tracked Arrivals: <span className="text-[#F5D061] font-bold">10 Players</span>
            </div>
          </div>

          <div className="glass-royal rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D4AF37]/25 text-[11px] font-mono uppercase text-[#F5D061] bg-[#050914]/90">
                    <th className="py-3.5 px-4">{lang === 'vi' ? 'Cầu thủ' : 'Player'}</th>
                    <th className="py-3.5 px-3">{lang === 'vi' ? 'Vị trí' : 'Pos'}</th>
                    <th className="py-3.5 px-3">{lang === 'vi' ? 'Kỳ CN' : 'Window'}</th>
                    <th className="py-3.5 px-3">{lang === 'vi' ? 'CLB Cũ' : 'Previous Club'}</th>
                    <th className="py-3.5 px-3">{lang === 'vi' ? 'Hình thức / Phí' : 'Fee / Type'}</th>
                    <th className="py-3.5 px-3">{lang === 'vi' ? 'Định giá' : 'Market Val'}</th>
                    <th className="py-3.5 px-3 text-right">
                      {lang === 'vi' ? 'Thống kê RM (Tr/B/KT/Cúp)' : 'RM Stats (M/G/A/T)'}
                    </th>
                    <th className="py-3.5 px-4 text-right">G+A/90</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/15">
                  {strategicTransfers.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setHeroSelectedPlayer(item.player)}
                      className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[#F8FAFC] flex items-center gap-2.5 whitespace-nowrap">
                        <span className="font-mono text-xs text-[#F5D061] font-bold w-7">
                          #{item.player.shirtNumber}
                        </span>
                        <CountryFlag nationality={item.player.nationality} />
                        <span className="font-semibold">{item.player.name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                        {item.player.specificPositions.join('/')}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                        {item.window}
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{item.from}</td>
                      <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                        {item.fee}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-semibold whitespace-nowrap">
                        {item.val}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#F8FAFC] text-right whitespace-nowrap">
                        {item.player.stats.appearances}M • {item.player.stats.goals}G •{' '}
                        {item.player.stats.assists}A • {item.player.stats.trophies}T
                      </td>
                      <td className="py-3 px-4 font-mono text-[#F5D061] font-semibold text-right whitespace-nowrap">
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
          className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#0B1224] border border-[#D4AF37]/40 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[#D4AF37]/25 flex items-center gap-3">
              <Search className="w-4 h-4 text-[#F5D061] shrink-0" />
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
                className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-slate-400 focus:outline-none"
              />
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#050914] border border-[#D4AF37]/30 text-[#F5D061]">
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
                    <span className="font-mono text-xs font-bold text-[#F5D061] w-7">
                      #{p.shirtNumber}
                    </span>
                    <CountryFlag nationality={p.nationality} />
                    <span className="text-xs font-semibold text-[#F8FAFC] truncate">{p.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {p.specificPositions.join('/')}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-slate-300 shrink-0">
                    {p.stats.appearances}M • {p.stats.goals}G • {p.stats.assists}A
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROYAL BERNABÉU EDITORIAL FOOTER */}
      <footer className="bg-[#050914] border-t border-[#D4AF37]/25 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0B1224] border border-[#D4AF37]/40 flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#F5D061]" />
            </div>
            <span className="font-royal font-bold text-[#F8FAFC] tracking-wide">
              HALAMADRID VN — Royal Bernabéu Editorial &amp; Opta Tactical Archive (1902–2026/27)
            </span>
          </div>
          <div className="font-mono text-[11px] text-[#F5D061]">
            Midnight Royal Navy #050914 • Cinzel &amp; JetBrains Mono • 15 UCL La Decimoquinta
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
