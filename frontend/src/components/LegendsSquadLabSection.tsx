import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Activity,
  BarChart3,
  Check,
  Crown,
  Filter,
  Flame,
  Gauge,
  Search,
  Shield,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);
import {
  Language,
  PlayerProfile,
  PositionGroup,
  Trident2026Analytics,
} from '../types/database';
import { PlayerAvatar } from './PlayerAvatar';
import { TiltCard } from './TiltCard';
import { PlayerWalkoutModal } from './PlayerWalkoutModal';
import { AnimatedCounter } from './AnimatedCounter';
import { EdaCorrelationLab, QuantitativeDataMatrix } from './EdaCorrelationLab';
import { CountryFlag } from './CountryFlag';

export interface SquadLabCommand {
  mode: 'all' | 'bmv_trio' | 'squad_2026_27' | 'three_peat';
  seq: number;
}

interface LegendsSquadLabSectionProps {
  players: PlayerProfile[];
  tridentAnalytics: Trident2026Analytics;
  lang: Language;
  externalCommand?: SquadLabCommand | null;
}

const RADAR_AXES: Array<{
  key: keyof PlayerProfile['radarPercentiles'];
  vi: string;
  en: string;
}> = [
  { key: 'scoring', vi: 'Dứt điểm / Phản xạ', en: 'Scoring / Reflexes' },
  { key: 'creativity', vi: 'Kiến tạo & Nhãn quan', en: 'Creativity & Vision' },
  { key: 'progression', vi: 'Tịnh tiến & Đột phá', en: 'Progression & Dribbling' },
  { key: 'paceAndPhysical', vi: 'Tốc độ & Thể chất', en: 'Pace & Physicality' },
  { key: 'defensiveWork', vi: 'Phòng ngự & Tranh chấp', en: 'Defensive Work' },
  { key: 'bigGameImpact', vi: 'Bản lĩnh C1 (DNA)', en: 'Big-Game DNA' },
];

const COMPARE_COLORS = ['#D4AF37', '#38BDF8', '#F43F5E'];

// 18 Core Members of the Historic Three-Peat UCL Dynasty (2015/16 • 2016/17 • 2017/18)
const THREE_PEAT_UCL_IDS: string[] = [
  'cristiano-ronaldo',
  'karim-benzema',
  'gareth-bale',
  'luka-modric',
  'toni-kroos',
  'casemiro',
  'isco',
  'sergio-ramos',
  'raphael-varane',
  'pepe',
  'marcelo',
  'dani-carvajal',
  'keylor-navas',
  'marco-asensio',
  'lucas-vazquez',
  'nacho-fernandez',
  'mateo-kovacic',
  'zinedine-zidane',
];

const THREE_PEAT_ROLE_BADGES_VI: Record<string, string> = {
  'cristiano-ronaldo': 'BBC • 43 Bàn C1 (2015–2018)',
  'karim-benzema': 'BBC • Trung Phong Kiến Tạo #9',
  'gareth-bale': 'BBC • Cú Đúp & Xe Đạp Chổng Ngược Kyiv 2018',
  'luka-modric': 'Tam Giác CMK • Quả Bóng Vàng 2018',
  'toni-kroos': 'Tam Giác CMK • Nhạc Trưởng 94% Chuyền Chính Xác',
  'casemiro': 'Tam Giác CMK • Lá Chắn Thép & Bàn Thắng Cardiff 2017',
  'isco': 'Hạt Nhân 4-3-1-2 Kim Cương (Cardiff 2017 & Kyiv 2018)',
  'sergio-ramos': 'Đội Trưởng Cú Ăn 3 C1 • Ghi Bàn Chung Kết 2016',
  'raphael-varane': 'Trung Vệ Đá Chính Cả 3 Chung Kết (2016–2018)',
  'pepe': 'Hòn Đá Tảng Chung Kết La Undécima 2016',
  'marcelo': 'Kiến Tạo Bàn Siêu Phẩm Ở Cả 3 Chung Kết C1',
  'dani-carvajal': 'Hậu Vệ Phải Huyền Thoại • Kiến Tạo Mở Tỷ Số 2017',
  'keylor-navas': 'Thủ Môn Bất Bại 3 Trận Chung Kết C1 Liên Tiếp',
  'marco-asensio': 'Ghi Bàn Ấn Định 4–1 Chung Kết C1 Cardiff 2017',
  'lucas-vazquez': 'Quả Luân Lưu Đầu Tiên Milan 2016 • Chiến Binh #17',
  'nacho-fernandez': 'Lá Chắn Đa Năng • Chung Kết Kyiv 2018',
  'mateo-kovacic': 'Động Cơ Tuyến Giữa • 3/3 Mùa Vô Địch C1',
  'zinedine-zidane': 'HLV Trưởng Duy Nhất Vô Địch 3 Cúp C1 Liên Tiếp',
};

const THREE_PEAT_ROLE_BADGES_EN: Record<string, string> = {
  'cristiano-ronaldo': 'BBC Trident • 43 UCL Goals (2015–2018)',
  'karim-benzema': 'BBC Trident • Link-Up #9 & Kyiv 2018 Opener',
  'gareth-bale': 'BBC Trident • Kyiv 2018 Bicycle Kick Brace',
  'luka-modric': 'CMK Midfield • 2018 Ballon d’Or Winner',
  'toni-kroos': 'CMK Midfield • 94% Pass Accuracy Metronome',
  'casemiro': 'CMK Midfield • Anchor & Cardiff 2017 Goalscorer',
  'isco': '4-3-1-2 Diamond #10 (Cardiff 2017 & Kyiv 2018)',
  'sergio-ramos': 'Three-Peat Captain • 2016 Milan Final Scorer',
  'raphael-varane': 'Started All 3 UCL Finals (2016–2018)',
  'pepe': 'Defensive Rock of La Undécima 2016',
  'marcelo': 'Assisted in the 2017 & 2018 UCL Finals',
  'dani-carvajal': 'Assisted Opener in 2017 Cardiff Final',
  'keylor-navas': 'Starting GK in All 3 Consecutive UCL Finals',
  'marco-asensio': 'Scored 4–1 Sealer in 2017 Cardiff Final',
  'lucas-vazquez': '1st Penalty Scorer in 2016 Milan Shootout',
  'nacho-fernandez': 'Versatile Defender • 2018 Kyiv Final',
  'mateo-kovacic': '3 UCL Titles in 3 Seasons (2015–2018)',
  'zinedine-zidane': 'Head Coach of the Historic 2016–2018 UCL Three-Peat',
};

export const LegendsSquadLabSection: React.FC<LegendsSquadLabSectionProps> = ({
  players,
  tridentAnalytics,
  lang,
  externalCommand,
}) => {
  // Active Part View: 'both' (shows Part 1 then Part 2), 'part1_squad', or 'part2_legends'
  const [sectionTab, setSectionTab] = useState<'both' | 'part1_squad' | 'part2_legends'>('both');

  // Part 1 Filters (2026/27 Squad)
  const [squadPosFilter, setSquadPosFilter] = useState<'ALL' | PositionGroup>('ALL');
  const [squadSearch, setSquadSearch] = useState<string>('');
  const [bmvTrioOnly, setBmvTrioOnly] = useState<boolean>(false);

  // Part 2 Filters (Three-Peat UCL 2015-2018 & All-Time Legends)
  const [legendEraFilter, setLegendEraFilter] = useState<'three_peat' | 'other_eras' | 'all_legends'>(
    'three_peat'
  );
  const [legendPosFilter, setLegendPosFilter] = useState<'ALL' | PositionGroup>('ALL');
  const [legendSearch, setLegendSearch] = useState<string>('');

  // Radar Comparison State (Default: Jude Bellingham #5 + BMV Trident)
  const [comparedIds, setComparedIds] = useState<string[]>([
    'jude-bellingham',
    'kylian-mbappe',
    'vinicius-junior',
  ]);
  const [modalPlayer, setModalPlayer] = useState<PlayerProfile | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const sectionRef = useRef<HTMLElement | null>(null);

  // Sync external navigation / Hero Stat Card / Sidebar Squad Tier commands
  useEffect(() => {
    if (!externalCommand) return;
    setViewMode('cards');
    if (externalCommand.mode === 'bmv_trio') {
      setSectionTab('part1_squad');
      setSquadPosFilter('ALL');
      setSquadSearch('');
      setBmvTrioOnly(true);
      setComparedIds(['kylian-mbappe', 'vinicius-junior', 'jude-bellingham']);
    } else if (externalCommand.mode === 'squad_2026_27') {
      setSectionTab('part1_squad');
      setSquadPosFilter('ALL');
      setSquadSearch('');
      setBmvTrioOnly(false);
    } else if (externalCommand.mode === 'three_peat') {
      setSectionTab('part2_legends');
      setLegendEraFilter('three_peat');
      setLegendPosFilter('ALL');
      setLegendSearch('');
      setBmvTrioOnly(false);
    } else {
      setSectionTab('both');
      setSquadPosFilter('ALL');
      setSquadSearch('');
      setBmvTrioOnly(false);
    }
  }, [externalCommand]);

  const judeBellingham = useMemo(
    () => players.find((p) => p.id === 'jude-bellingham') ?? null,
    [players]
  );

  // Part 1: 2026/27 Official Squad Players
  const squad2026Players = useMemo(() => {
    const bmvIds = ['kylian-mbappe', 'vinicius-junior', 'jude-bellingham'];
    const base = players.filter((p) => p.category === 'squad_2026_27');
    if (bmvTrioOnly) {
      return bmvIds
        .map((id) => base.find((p) => p.id === id))
        .filter((p): p is PlayerProfile => Boolean(p));
    }
    return base.filter((p) => {
      if (squadPosFilter !== 'ALL' && p.positionGroup !== squadPosFilter) return false;
      if (squadSearch.trim()) {
        const q = squadSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          String(p.shirtNumber).includes(q) ||
          p.specificPositions.join(' ').toLowerCase().includes(q) ||
          p.nationality.vi.toLowerCase().includes(q) ||
          p.nationality.en.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [players, squadPosFilter, squadSearch, bmvTrioOnly]);

  // Part 2: Legends (Three-Peat UCL 2015–2018 & All-Time Legends)
  const legendPlayers = useMemo(() => {
    const allLegends = players.filter((p) => p.category === 'legend');

    let subset: PlayerProfile[];
    if (legendEraFilter === 'three_peat') {
      const orderMap = new Map(THREE_PEAT_UCL_IDS.map((id, idx) => [id, idx]));
      subset = allLegends
        .filter((p) => orderMap.has(p.id))
        .sort((a, b) => (orderMap.get(a.id) ?? 99) - (orderMap.get(b.id) ?? 99));
    } else if (legendEraFilter === 'other_eras') {
      const threePeatSet = new Set(THREE_PEAT_UCL_IDS);
      subset = allLegends.filter((p) => !threePeatSet.has(p.id));
    } else {
      subset = allLegends;
    }

    return subset.filter((p) => {
      if (legendPosFilter !== 'ALL' && p.positionGroup !== legendPosFilter) return false;
      if (legendSearch.trim()) {
        const q = legendSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          String(p.shirtNumber).includes(q) ||
          p.specificPositions.join(' ').toLowerCase().includes(q) ||
          p.nationality.vi.toLowerCase().includes(q) ||
          p.nationality.en.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [players, legendEraFilter, legendPosFilter, legendSearch]);

  // Unified Active Cohort & Position Filter for EDA Lab & Quantitative Data Matrix
  const activeGroupFilter: 'all' | 'squad_2026_27' | 'three_peat' | 'all_legends' =
    sectionTab === 'part1_squad'
      ? 'squad_2026_27'
      : sectionTab === 'part2_legends'
      ? legendEraFilter === 'three_peat'
        ? 'three_peat'
        : 'all_legends'
      : 'all';

  const activePosFilter: 'ALL' | PositionGroup =
    sectionTab === 'part2_legends' ? legendPosFilter : squadPosFilter;

  const handleLabGroupFilterChange = (
    group: 'all' | 'squad_2026_27' | 'three_peat' | 'all_legends'
  ) => {
    if (group === 'all') {
      setSectionTab('both');
      setLegendEraFilter('all_legends');
    } else if (group === 'squad_2026_27') {
      setSectionTab('part1_squad');
    } else if (group === 'three_peat') {
      setSectionTab('part2_legends');
      setLegendEraFilter('three_peat');
    } else {
      setSectionTab('part2_legends');
      setLegendEraFilter('all_legends');
    }
  };

  const handleLabPosFilterChange = (pos: 'ALL' | PositionGroup) => {
    setSquadPosFilter(pos);
    setLegendPosFilter(pos);
  };

  const edaFilteredPlayers = useMemo(() => {
    if (sectionTab === 'part1_squad') {
      return squad2026Players;
    }
    if (sectionTab === 'part2_legends') {
      return legendPlayers;
    }
    // sectionTab === 'both' -> All 74 players filtered by active position & search
    return players.filter((p) => {
      if (squadPosFilter !== 'ALL' && p.positionGroup !== squadPosFilter) return false;
      const q = (squadSearch || legendSearch).trim().toLowerCase();
      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          String(p.shirtNumber).includes(q) ||
          p.specificPositions.join(' ').toLowerCase().includes(q) ||
          p.nationality.vi.toLowerCase().includes(q) ||
          p.nationality.en.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    sectionTab,
    squad2026Players,
    legendPlayers,
    players,
    squadPosFilter,
    squadSearch,
    legendSearch,
  ]);

  const activeFilterLabel = useMemo(() => {
    const posSuffix = activePosFilter === 'ALL' ? '' : ` • ${activePosFilter}`;
    if (activeGroupFilter === 'squad_2026_27') {
      return (lang === 'vi' ? 'Đội hình 2026/27' : '2026/27 Squad') + posSuffix;
    }
    if (activeGroupFilter === 'three_peat') {
      return (lang === 'vi' ? 'Huyền thoại Ăn 3 C1' : '3-Peat UCL Legends') + posSuffix;
    }
    if (activeGroupFilter === 'all_legends') {
      return (lang === 'vi' ? 'Đại Sảnh Huyền Thoại' : 'All-Time Legends') + posSuffix;
    }
    return (lang === 'vi' ? 'Tất cả cầu thủ (1902–2026)' : 'All Players (1902–2026)') + posSuffix;
  }, [activeGroupFilter, activePosFilter, lang]);

  const comparedPlayers = useMemo(
    () =>
      comparedIds
        .map((id) => players.find((p) => p.id === id))
        .filter((p): p is PlayerProfile => Boolean(p)),
    [comparedIds, players]
  );

  const toggleComparePlayer = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  // Compute SVG Polygon Points for 6-Axis Radar
  const getRadarPolygonPoints = (player: PlayerProfile, radius = 105, center = 140) => {
    return RADAR_AXES.map((axis, idx) => {
      const angle = (Math.PI * 2 * idx) / RADAR_AXES.length - Math.PI / 2;
      const val = (player.radarPercentiles[axis.key] ?? 50) / 100;
      const r = val * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  // GSAP ScrollTrigger animation for Royal Collector Cards (gsap-react + gsap-scrolltrigger)
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.royal-collector-card');
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.035,
          ease: 'power3.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [sectionTab, squadPosFilter, legendEraFilter, viewMode] }
  );

  const renderPlayerCard = (player: PlayerProfile, showThreePeatBadge = false, idx = 0) => {
    const isCompared = comparedIds.includes(player.id);
    const isBellingham = player.id === 'jude-bellingham';
    const threePeatBadge = showThreePeatBadge
      ? lang === 'vi'
        ? THREE_PEAT_ROLE_BADGES_VI[player.id]
        : THREE_PEAT_ROLE_BADGES_EN[player.id]
      : undefined;

    return (
      <TiltCard
        key={player.id}
        onClick={() => setModalPlayer(player)}
        style={{ '--stagger-delay': `${Math.min(idx * 40, 320)}ms` } as React.CSSProperties}
        className={`royal-collector-card royal-card-hover cursor-pointer group rounded-2xl overflow-hidden border flex flex-col justify-between ${
          isBellingham
            ? 'bg-gradient-to-b from-[#1A2442] to-[#0B1224] border-[#F5D061] shadow-[0_0_28px_rgba(212,175,55,0.28)]'
            : 'bg-[#0B1224]/90 border-[#D4AF37]/30 hover:border-[#F5D061]'
        }`}
      >
        <div>
          {/* Portrait Header with Giant Watermark Shirt Number Behind */}
          <div className="keep-dark-surface relative h-72 w-full bg-[#050914] overflow-hidden">
            {/* Giant Oversized Watermark Jersey Number in Background */}
            <div
              aria-hidden="true"
              className="font-royal absolute -right-2 top-6 text-[92px] leading-none font-black text-[#D4AF37]/[0.13] group-hover:text-[#F5D061]/[0.22] transition-colors select-none pointer-events-none z-0"
            >
              {player.shirtNumber}
            </div>

            <div className="relative z-[1] w-full h-full">
              <PlayerAvatar
                src={player.imageUrl}
                name={player.name}
                shirtNumber={player.shirtNumber}
                position={player.specificPositions.join(', ')}
                className="w-full h-full object-cover object-[center_top] royal-portrait-zoom"
              />
            </div>
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#050914] via-[#050914]/20 to-transparent" />

            {/* Top Left Three-Peat Crown or Captain Badge if applicable */}
            {player.id === 'federico-valverde' ? (
              <div className="absolute top-3 left-3 z-[3] font-mono text-[11px] px-2 py-0.5 rounded-md bg-amber-500/15 text-[#F5D061] border border-[#D4AF37]/50 backdrop-blur-sm shadow">
                {lang === 'vi' ? '(C) ĐỘI TRƯỞNG' : '(C) CAPTAIN'}
              </div>
            ) : (
              threePeatBadge && (
                <div className="absolute top-3 left-3 z-[3] px-2 py-0.5 rounded-md bg-[#050914]/90 border border-[#D4AF37]/60 text-[#F5D061] font-extrabold text-[10px] uppercase tracking-wider shadow">
                  {lang === 'vi' ? 'ĂN 3 C1 🏆' : '3-PEAT UCL 🏆'}
                </div>
              )
            )}

            {/* Top Right Metallic Royal Gold Jersey Number Badge */}
            <div className="absolute top-3 right-3 z-[3] px-2.5 py-1 rounded-lg bg-gradient-to-br from-[#F5D061] to-[#D4AF37] text-[#050914] font-mono font-extrabold text-xs shadow-md">
              #{player.shirtNumber}
            </div>

            {/* Bottom Name Overlay */}
            <div className="absolute bottom-3 inset-x-3 z-[3]">
              <div className="text-[11px] font-bold text-[#F5D061] flex items-center justify-between">
                <span className="inline-flex items-center">
                  <CountryFlag nationality={player.nationality} />
                  <span>
                    {player.positionGroup} • {player.specificPositions.join('/')}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-slate-300">{player.era}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <h4 className="font-royal text-lg font-extrabold text-[#F8FAFC] leading-tight truncate">
                  {player.name}
                </h4>
                {player.id === 'federico-valverde' && (
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-amber-500/15 text-[#F5D061] border border-[#D4AF37]/40 shrink-0">
                    {lang === 'vi' ? '(C) ĐỘI TRƯỞNG' : '(C) CAPTAIN'}
                  </span>
                )}
              </div>
              {threePeatBadge && (
                <div className="text-[10px] font-bold text-emerald-300 truncate mt-0.5">
                  {threePeatBadge}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-4 gap-1.5 text-center bg-[#050914]/85 rounded-xl p-2 border border-[#D4AF37]/20">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  {lang === 'vi' ? 'Trận' : 'Apps'}
                </div>
                <div className="font-mono text-xs font-extrabold text-[#F8FAFC]">
                  {player.stats.appearances}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  {lang === 'vi' ? 'Bàn' : 'Goals'}
                </div>
                <div className="font-mono text-xs font-extrabold text-[#F5D061]">
                  {player.stats.goals}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">G+A/90</div>
                <div className="font-mono text-xs font-extrabold text-emerald-400">
                  {player.stats.gaPer90.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">km/h</div>
                <div className="font-mono text-xs font-extrabold text-sky-400">
                  {player.stats.topSpeedKmh.toFixed(1)}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {player.bio[lang]}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4 pt-1 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleComparePlayer(player.id);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              isCompared
                ? 'bg-[#D4AF37]/25 border-[#F5D061] text-[#F5D061]'
                : 'bg-[#050914]/80 border-[#D4AF37]/25 text-slate-300 hover:border-[#D4AF37]/60'
            }`}
          >
            {isCompared ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Radar</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalPlayer(player);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D061] hover:brightness-110 text-[#050914] text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow whitespace-nowrap"
          >
            <span>{lang === 'vi' ? 'Xem Hồ Sơ' : 'View Profile'}</span>
          </button>
        </div>
      </TiltCard>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="datalab"
      className="heavy-section-deferred py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D4AF37]/20"
    >
      {/* Section Header & 2-Part Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-semibold uppercase tracking-widest mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi'
                ? 'Phân Hệ 3 • Đội Hình Mùa 2026/27 & Đế Chế Huyền Thoại Ăn 3 C1'
                : 'Module 3 • 2026/27 Official Squad & Three-Peat UCL Dynasty'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'vi'
              ? 'ĐỘI HÌNH MÙA GIẢI 2026/27 & ĐẠI SẢNH HUYỀN THOẠI (1902–2026)'
              : '2026/27 OFFICIAL SQUAD & ALL-TIME LEGENDS HALL OF FAME'}
          </h2>
        </div>

        {/* Section Quick Switcher Bar */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSectionTab('both')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap ${
              sectionTab === 'both'
                ? 'bg-[#D4AF37] text-[#060913] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                : 'bg-[#0D1326] text-slate-300 border border-white/10 hover:border-[#D4AF37]/50'
            }`}
          >
            {lang === 'vi' ? 'Xem Cả 2 Phần (74)' : 'Show Both Parts (74)'}
          </button>
          <button
            onClick={() => setSectionTab('part1_squad')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              sectionTab === 'part1_squad'
                ? 'bg-[#D4AF37] text-[#060913] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                : 'bg-[#0D1326] text-slate-300 border border-white/10 hover:border-[#D4AF37]/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Phần 1: Đội Hình 2026/27 (32)' : 'Part 1: 2026/27 Squad (32)'}</span>
          </button>
          <button
            onClick={() => setSectionTab('part2_legends')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              sectionTab === 'part2_legends'
                ? 'bg-[#D4AF37] text-[#060913] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                : 'bg-[#0D1326] text-slate-300 border border-white/10 hover:border-[#D4AF37]/50'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi'
                ? 'Phần 2: Ăn 3 C1 & Huyền Thoại (42)'
                : 'Part 2: 3-Peat & Legends (42)'}
            </span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE 6-AXIS RADAR & SCATTER PLOT COMPARISON LAB */}
      <div id="player-stats" className="glass-royal rounded-xl p-6 sm:p-8 mb-12 scroll-mt-16">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#F5D061]" />
              <span>
                {lang === 'vi'
                  ? 'Phòng Thí Nghiệm So Sánh Đa Chiều: Radar 6 Trục & Biểu Đồ Phân Tán'
                  : 'Multi-Dimensional Quantitative Lab: 6-Axis Radar & Scatter Plot'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'vi'
                ? 'So sánh trực tiếp tối đa 3 cầu thủ xuyên thời đại. Bấm nút "Radar" trên bất kỳ thẻ cầu thủ nào bên dưới để đưa vào biểu đồ.'
                : 'Comparing up to 3 players simultaneously. Click "Radar" on any player card below to swap.'}
            </p>
          </div>

          {/* Active Compared Player Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {comparedPlayers.map((p, idx) => (
              <div
                key={p.id}
                style={{ borderColor: COMPARE_COLORS[idx] }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#060913] border-2 text-xs font-semibold"
              >
                <span
                  style={{ backgroundColor: COMPARE_COLORS[idx] }}
                  className="w-2.5 h-2.5 rounded-full"
                />
                <span className="text-white">
                  {p.id === 'yan-diomande' ? p.name : `#${p.shirtNumber} ${p.name}`}
                </span>
                {comparedPlayers.length > 1 && (
                  <button
                    onClick={() => toggleComparePlayer(p.id)}
                    className="text-slate-400 hover:text-white ml-1"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 6-Axis SVG Radar Chart */}
          <div className="keep-dark-surface lg:col-span-5 flex flex-col items-center bg-[#080E20] rounded-2xl p-4 border border-[#D4AF37]/30">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F5D061] mb-2">
              {lang === 'vi' ? 'Biểu Đồ Radar Phân Vị 6 Trục (0–99)' : '6-Axis Percentile Radar (0–99)'}
            </div>
            <svg viewBox="0 0 280 280" className="w-full max-w-[300px] h-auto overflow-visible">
              {[0.25, 0.5, 0.75, 1].map((scale) => {
                const pts = RADAR_AXES.map((_, idx) => {
                  const angle = (Math.PI * 2 * idx) / RADAR_AXES.length - Math.PI / 2;
                  const r = scale * 105;
                  return `${(140 + r * Math.cos(angle)).toFixed(1)},${(
                    140 +
                    r * Math.sin(angle)
                  ).toFixed(1)}`;
                }).join(' ');
                return (
                  <polygon
                    key={scale}
                    points={pts}
                    fill="none"
                    stroke="rgba(212,175,55,0.28)"
                    strokeWidth="1"
                  />
                );
              })}

              {RADAR_AXES.map((axis, idx) => {
                const angle = (Math.PI * 2 * idx) / RADAR_AXES.length - Math.PI / 2;
                const x2 = 140 + 105 * Math.cos(angle);
                const y2 = 140 + 105 * Math.sin(angle);
                const lx = 140 + 128 * Math.cos(angle);
                const ly = 140 + 122 * Math.sin(angle);
                return (
                  <g key={axis.key}>
                    <line
                      x1="140"
                      y1="140"
                      x2={x2}
                      y2={y2}
                      stroke="rgba(255,255,255,0.16)"
                      strokeWidth="1"
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#f1f5f9"
                      fontSize="8.5"
                      fontWeight="700"
                    >
                      {axis[lang]}
                    </text>
                  </g>
                );
              })}

              {comparedPlayers.map((player, idx) => (
                <polygon
                  key={player.id}
                  points={getRadarPolygonPoints(player)}
                  fill={COMPARE_COLORS[idx]}
                  fillOpacity="0.22"
                  stroke={COMPARE_COLORS[idx]}
                  strokeWidth="2.5"
                  style={{
                    transformOrigin: '140px 140px',
                    transition: 'all 380ms var(--ease-out-expo)',
                  }}
                />
              ))}
            </svg>
          </div>

          {/* Right: Quantitative Scatter Plot & Direct Comparison Table */}
          <div className="lg:col-span-7 space-y-5">
            <div className="keep-dark-surface bg-[#080E20] rounded-2xl p-5 border border-[#D4AF37]/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F5D061]">
                  {lang === 'vi'
                    ? 'Biểu Đồ Phân Tán: Tốc Độ Bứt Tốc (km/h) × Hiệu Suất G+A/90'
                    : 'Scatter Plot: Peak Sprint Speed (km/h) × G+A per 90'}
                </span>
                <span className="text-[11px] font-semibold text-slate-300">
                  {lang === 'vi' ? 'Click điểm để chọn cầu thủ' : 'Click dot to toggle player'}
                </span>
              </div>
              <svg viewBox="0 0 500 200" className="w-full h-auto bg-[#050914] rounded-xl border border-white/10">
                {[40, 80, 120, 160].map((y) => (
                  <line key={y} x1="45" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.08)" />
                ))}
                <text x="260" y="192" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="600">
                  {lang === 'vi' ? 'Tốc độ bứt tốc tối đa (30.0 km/h → 37.0 km/h)' : 'Peak Sprint Velocity (30.0 km/h → 37.0 km/h)'}
                </text>
                <text x="14" y="100" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="600" transform="rotate(-90 14 100)">
                  G+A / 90
                </text>

                {players.map((p) => {
                  const x = 45 + ((Math.min(Math.max(p.stats.topSpeedKmh, 30), 37) - 30) / 7) * 425;
                  const y = 170 - (Math.min(p.stats.gaPer90, 1.45) / 1.45) * 145;
                  const compIdx = comparedPlayers.findIndex((cp) => cp.id === p.id);
                  const isHighlighted = compIdx !== -1;
                  return (
                    <g
                      key={p.id}
                      onClick={() => toggleComparePlayer(p.id)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHighlighted ? 7.5 : 3.5}
                        fill={isHighlighted ? COMPARE_COLORS[compIdx] : 'rgba(148,163,184,0.4)'}
                        stroke={isHighlighted ? '#ffffff' : 'none'}
                        strokeWidth={isHighlighted ? 1.5 : 0}
                      />
                      {isHighlighted && (
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          fill={COMPARE_COLORS[compIdx]}
                          fontSize="9.5"
                          fontWeight="800"
                        >
                          {p.id === 'yan-diomande'
                            ? `${p.name.split(' ').pop()} (${p.stats.topSpeedKmh}km/h)`
                            : `#${p.shirtNumber} ${p.name.split(' ').pop()} (${p.stats.topSpeedKmh}km/h)`}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase">
                    <th className="py-2 pr-3">{lang === 'vi' ? 'Cầu thủ' : 'Player'}</th>
                    <th className="py-2 px-2">{lang === 'vi' ? 'Trận / Bàn / KT' : 'Apps / G / A'}</th>
                    <th className="py-2 px-2">G+A/90</th>
                    <th className="py-2 px-2">{lang === 'vi' ? 'Tốc độ' : 'Top Speed'}</th>
                    <th className="py-2 pl-2">{lang === 'vi' ? 'Điểm chuẩn hóa (Z)' : 'Era Z-Score'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparedPlayers.map((p, idx) => (
                    <tr
                      key={p.id}
                      onClick={() => setModalPlayer(p)}
                      className="hover:bg-white/5 cursor-pointer"
                    >
                      <td className="py-2.5 pr-3 font-bold text-white flex items-center gap-2">
                        <span
                          style={{ backgroundColor: COMPARE_COLORS[idx] }}
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                        />
                        <span>
                          {p.id === 'yan-diomande' ? p.name : `#${p.shirtNumber} ${p.name}`}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-slate-200">
                        {p.stats.appearances} / {p.stats.goals} / {p.stats.assists}
                      </td>
                      <td className="py-2.5 px-2 font-extrabold text-emerald-500">
                        {p.stats.gaPer90.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-[#F5D061]">
                        {p.stats.topSpeedKmh.toFixed(1)} km/h
                      </td>
                      <td className="py-2.5 pl-2 font-extrabold text-sky-500">
                        +{p.stats.eraZScore.toFixed(2)}σ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
         PHÒNG THÍ NGHIỆM KHAI PHÁ DỮ LIỆU (EDA & CORRELATION LAB + SUMMARY STATS + VIEW TOGGLE)
         ========================================================================== */}
      <EdaCorrelationLab
        allPlayers={players}
        filteredPlayers={edaFilteredPlayers}
        filterLabel={activeFilterLabel}
        activeGroupFilter={activeGroupFilter}
        activePosFilter={activePosFilter}
        onGroupFilterChange={handleLabGroupFilterChange}
        onPosFilterChange={handleLabPosFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSelectPlayer={setModalPlayer}
        lang={lang}
      />

      {viewMode === 'matrix' ? (
        <QuantitativeDataMatrix
          players={edaFilteredPlayers}
          comparedIds={comparedIds}
          onToggleCompare={toggleComparePlayer}
          onSelectPlayer={setModalPlayer}
          lang={lang}
        />
      ) : (
        <>
          {/* ==========================================================================
             PHẦN 1: ĐỘI HÌNH HIỆN TẠI MÙA GIẢI 2026/27 (32 CẦU THỦ)
             ========================================================================== */}
          {(sectionTab === 'both' || sectionTab === 'part1_squad') && (
        <div id="squad" className="mb-16 scroll-mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-[#D4AF37]/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#060913] font-black text-base flex items-center justify-center shadow">
                01
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#F5D061]">
                  {lang === 'vi'
                    ? 'PHẦN 1 • ĐỘI HÌNH MÙA GIẢI HIỆN TẠI'
                    : 'PART 1 • CURRENT SEASON OFFICIAL SQUAD'}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {lang === 'vi'
                    ? 'ĐỘI HÌNH CHÍNH THỨC MÙA GIẢI 2026/27 (32 CẦU THỦ)'
                    : '2026/27 OFFICIAL FIRST-TEAM SQUAD (32 PLAYERS)'}
                </h3>
              </div>
            </div>

            {/* Part 1 Filter Bar (GK / DEF / MID / FWD + Search) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center bg-[#0D1326] p-1 rounded-xl border border-white/10">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37] ml-2 mr-1" />
                {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setSquadPosFilter(pos)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                      squadPosFilter === pos
                        ? 'bg-[#16203D] text-[#F5D061] border border-[#D4AF37]/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={squadSearch}
                  onChange={(e) => setSquadSearch(e.target.value)}
                  placeholder={
                    lang === 'vi'
                      ? 'Tìm cầu thủ 2026/27 (#5, #10, #7)...'
                      : 'Search 2026/27 squad (#5, #10, #7)...'
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D1326] border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F5D061]"
                />
              </div>
            </div>
          </div>

          {/* #5 JUDE BELLINGHAM & BMV TRIDENT 2026/27 SPOTLIGHT BANNER */}
          {judeBellingham && (
            <div id="bmv-spotlight" className="glass-gold rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden scroll-mt-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-3 flex flex-col items-center">
                  <TiltCard
                    onClick={() => setModalPlayer(judeBellingham)}
                    className="keep-dark-surface cursor-pointer w-48 h-60 rounded-2xl overflow-hidden border-2 border-[#F5D061] shadow-[0_0_30px_rgba(212,175,55,0.35)] bg-[#060913]"
                  >
                    <PlayerAvatar
                      src={judeBellingham.imageUrl}
                      name={judeBellingham.name}
                      shirtNumber={judeBellingham.shirtNumber}
                      position="AM / CM"
                      priority
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-[#D4AF37] text-[#060913] font-extrabold text-xs">
                      #5
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#060913] via-[#060913]/90 to-transparent p-3">
                      <div className="text-sm font-bold text-white">{judeBellingham.name}</div>
                      <div className="text-[11px] font-bold text-[#F5D061] flex items-center">
                        <CountryFlag nationality={judeBellingham.nationality} />
                        <span>{judeBellingham.nationality[lang]} • AM/CM</span>
                      </div>
                    </div>
                  </TiltCard>
                  <button
                    onClick={() => setModalPlayer(judeBellingham)}
                    className="mt-3 w-48 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5D061] text-[#060913] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md whitespace-nowrap"
                  >
                    <span>{lang === 'vi' ? 'Xem Hồ Sơ' : 'View Profile'}</span>
                  </button>
                </div>

                <div className="lg:col-span-9 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#060913] text-xs font-extrabold uppercase">
                      {lang === 'vi' ? 'Tâm Điểm Mùa Giải 2026/27' : '2026/27 Central Spotlight'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#060913]/80 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-semibold inline-flex items-center">
                      <span>
                        {lang === 'vi' ? 'Sinh ngày: 29/06/2003 • Anh' : 'Born: 29/06/2003 • England'}
                      </span>
                      <CountryFlag
                        nationality={judeBellingham.nationality}
                        className="inline-block w-4 h-3 object-cover rounded-[2px] shadow-sm ml-1.5 align-middle"
                      />
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#060913]/80 border border-[#D4AF37]/40 text-emerald-500 text-xs font-bold">
                      {lang === 'vi'
                        ? `Định giá: ${judeBellingham.marketValue} • ${judeBellingham.stats.trophies} Danh hiệu Hoàng gia`
                        : `Value: ${judeBellingham.marketValue} • ${judeBellingham.stats.trophies} Royal Trophies`}
                    </span>
                  </div>

                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {tridentAnalytics.title[lang]}
                  </h4>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    {tridentAnalytics.insight[lang]}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-[#060913]/85 rounded-xl p-3.5 border border-[#D4AF37]/30">
                      <div className="text-[11px] uppercase text-slate-400 font-semibold">
                        {lang === 'vi' ? 'Thành tích #5 Bellingham' : '#5 Bellingham Record'}
                      </div>
                      <div className="text-lg font-extrabold text-white mt-0.5">
                        {judeBellingham.stats.appearances} {lang === 'vi' ? 'trận' : 'apps'} •{' '}
                        {judeBellingham.stats.goals}G • {judeBellingham.stats.assists}A
                      </div>
                    </div>
                    <div className="bg-[#060913]/85 rounded-xl p-3.5 border border-[#D4AF37]/30">
                      <div className="text-[11px] uppercase text-slate-400 font-semibold">
                        {lang === 'vi' ? 'Hiệu suất #5 G+A / 90' : '#5 G+A per 90 Mins'}
                      </div>
                      <div className="text-lg font-extrabold text-emerald-500 mt-0.5">
                        <AnimatedCounter
                          value={judeBellingham.stats.gaPer90}
                          decimals={2}
                          suffix=" / 90'"
                        />
                      </div>
                    </div>
                    <div className="bg-[#060913]/85 rounded-xl p-3.5 border border-[#D4AF37]/30">
                      <div className="text-[11px] uppercase text-slate-400 font-semibold">
                        {lang === 'vi' ? 'Tổng G+A/90 Tam Tấu BMV' : 'BMV Combined G+A/90'}
                      </div>
                      <div className="text-lg font-extrabold text-[#F5D061] mt-0.5 flex items-center gap-1">
                        <Gauge className="w-4 h-4" />
                        <AnimatedCounter value={tridentAnalytics.combinedGaPer90} decimals={2} suffix=" / 90'" />
                      </div>
                    </div>
                    <div className="bg-[#060913]/85 rounded-xl p-3.5 border border-[#D4AF37]/30">
                      <div className="text-[11px] uppercase text-slate-400 font-semibold">
                        {lang === 'vi' ? 'Vận tốc Tam Tấu TB' : 'Trident Avg Velocity'}
                      </div>
                      <div className="text-lg font-extrabold text-sky-500 mt-0.5">
                        <AnimatedCounter
                          value={tridentAnalytics.averageTopSpeedKmh}
                          decimals={2}
                          suffix=" km/h"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active BMV Trio Filter Banner when bmvTrioOnly is active */}
          {bmvTrioOnly && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#121212] border border-white/[0.12] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-white font-medium">
                <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                <span>
                  {lang === 'vi'
                    ? 'Đang lọc riêng Tam Tấu BMV: #10 Kylian Mbappé × #7 Vinícius Jr. × #5 Jude Bellingham (2.35 G+A/90)'
                    : 'Filtered to BMV Trident: #10 Kylian Mbappé × #7 Vinícius Jr. × #5 Jude Bellingham (2.35 G+A/90)'}
                </span>
              </div>
              <button
                onClick={() => setBmvTrioOnly(false)}
                className="px-3 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs font-mono text-white transition-colors"
              >
                {lang === 'vi' ? 'Xem tất cả 32 cầu thủ →' : 'Show all 32 squad players →'}
              </button>
            </div>
          )}

          {/* Part 1 Grid: 2026/27 Squad Cards */}
          <div
            key={`part1-${sectionTab}-${squadPosFilter}-${bmvTrioOnly}`}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {squad2026Players.map((player, idx) => renderPlayerCard(player, false, idx))}
          </div>
        </div>
      )}

      {/* ==========================================================================
         PHẦN 2: ĐỘI HÌNH HUYỀN THOẠI CÚ ĂN 3 C1 LỊCH SỬ (2015–2018) & ĐẠI SẢNH HUYỀN THOẠI
         ========================================================================== */}
      {(sectionTab === 'both' || sectionTab === 'part2_legends') && (
        <div id="three-peat-section" className="scroll-mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-[#D4AF37]/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#060913] font-black text-base flex items-center justify-center shadow">
                02
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#F5D061]">
                  {lang === 'vi'
                    ? 'PHẦN 2 • ĐẾ CHẾ BẤT TỬ CHAMPIONS LEAGUE & ĐẠI SẢNH HUYỀN THOẠI'
                    : 'PART 2 • HISTORIC UCL THREE-PEAT DYNASTY & ALL-TIME LEGENDS'}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {lang === 'vi'
                    ? 'ĐỘI HÌNH HUYỀN THOẠI ĂN 3 C1 (2015/16 • 2016/17 • 2017/18) & ĐẠI SẢNH HUYỀN THOẠI'
                    : 'THREE-PEAT UCL DYNASTY (2015–2018) & ALL-TIME LEGENDS'}
                </h3>
              </div>
            </div>
          </div>

          {/* THREE-PEAT UCL DYNASTY SPOTLIGHT CARD */}
          <div className="glass-gold rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#060913] text-xs font-extrabold uppercase flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                {lang === 'vi'
                  ? 'Kỳ Tích Độc Nhất Kỷ Nguyên Champions League: 1.000+ Ngày Trị Vì Châu Âu'
                  : 'Unprecedented Modern UCL Era Record: 3 Consecutive Titles (2016–2018)'}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#060913]/85 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-bold">
                HLV Trưởng: Zinedine Zidane • 100% Thắng Knock-out C1 (12/12 Cặp Đấu)
              </span>
            </div>

            <h4 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {lang === 'vi'
                ? 'PHÂN TÍCH ĐẾ CHẾ ĂN 3 C1 LỊCH SỬ (LA UNDÉCIMA • LA DUODÉCIMA • LA DECIMOTERCERA)'
                : 'THE IMMORTAL UCL THREE-PEAT DYNASTY (2015/16 • 2016/17 • 2017/18)'}
            </h4>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
              {lang === 'vi'
                ? 'Kể từ khi Cúp C1 đổi tên thành UEFA Champions League năm 1992, chưa từng có bất kỳ câu lạc bộ nào bảo vệ thành công ngôi vương — cho đến khi Real Madrid của HLV Zinedine Zidane vô địch 3 mùa giải liên tiếp (2015/16, 2016/17, 2017/18). Sự kết hợp giữa sức hủy diệt của Tam tấu BBC (Bale – Benzema – Cristiano Ronaldo), bộ não điều tiết siêu việt của Tam giác tuyến giữa CMK (Casemiro – Modrić – Kroos), nhạc trưởng Isco trong sơ đồ 4-3-1-2 Kim cương cùng cặp hậu vệ cánh toàn năng nhất lịch sử (Marcelo – Carvajal) và thủ lĩnh Sergio Ramos đã biến Real Madrid thành tập thể bất khả chiến bại.'
                : 'Since the creation of the UEFA Champions League in 1992, no club had ever successfully defended the trophy—until Zinedine Zidane’s Real Madrid won three consecutive titles (2015/16, 2016/17, 2017/18), powered by the BBC trident, the CMK midfield triangle, Isco’s 4-3-1-2 diamond mastery, and captain Sergio Ramos.'}
            </p>

            {/* 3 Finals Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#060913]/90 rounded-xl p-4 border border-[#D4AF37]/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-[#F5D061]">
                    2015/16 • LA UNDÉCIMA (11)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D061] text-[11px] font-bold">
                    Milan • 28/05/2016
                  </span>
                </div>
                <div className="text-base font-black text-white mb-1">
                  Real Madrid 1–1 Atlético Madrid (5–3 pen)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'vi'
                    ? 'Sergio Ramos mở tỷ số phút 15; Lucas Vázquez, Marcelo, Bale, Ramos và Cristiano Ronaldo thực hiện hoàn hảo cả 5 lượt sút luân lưu tại San Siro.'
                    : 'Sergio Ramos opened the scoring; Vázquez, Marcelo, Bale, Ramos, and Cristiano Ronaldo converted all 5 shootout penalties at San Siro.'}
                </p>
              </div>

              <div className="bg-[#060913]/90 rounded-xl p-4 border border-[#D4AF37]/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-[#F5D061]">
                    2016/17 • LA DUODÉCIMA (12)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D061] text-[11px] font-bold">
                    Cardiff • 03/06/2017
                  </span>
                </div>
                <div className="text-base font-black text-white mb-1">
                  Real Madrid 4–1 Juventus
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'vi'
                    ? 'Đỉnh cao sơ đồ 4-3-1-2 Kim cương với Isco hộ công sau Benzema – Ronaldo. CR7 lập cú đúp, Casemiro sút xa sấm sét và Marco Asensio ấn định thắng lợi 4–1.'
                    : 'Peak 4-3-1-2 Diamond with Isco behind Ronaldo and Benzema. CR7 scored twice alongside Casemiro and Marco Asensio in a 4–1 masterclass.'}
                </p>
              </div>

              <div className="bg-[#060913]/90 rounded-xl p-4 border border-[#D4AF37]/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-[#F5D061]">
                    2017/18 • LA DECIMOTERCERA (13)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D061] text-[11px] font-bold">
                    Kyiv • 26/05/2018
                  </span>
                </div>
                <div className="text-base font-black text-white mb-1">
                  Real Madrid 3–1 Liverpool
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'vi'
                    ? 'Karim Benzema mở tỷ số và Gareth Bale vào sân lập cú đúp lịch sử, trong đó có cú xe đạp chổng ngược từ quả tạt của Marcelo ở phút 64.'
                    : 'Karim Benzema opened the scoring before Gareth Bale’s legendary bicycle kick and long-range brace sealed a 3–1 win.'}
                </p>
              </div>
            </div>

            {/* Immortal Core Stats Strip (BBC + CMK + 12/12 Knockout) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#060913]/85 rounded-xl p-3.5 border border-[#D4AF37]/30">
                <div className="text-[11px] uppercase text-slate-400 font-bold">
                  {lang === 'vi' ? 'Tam Tấu BBC (Bale-Benzema-CR7)' : 'BBC Attacking Trident'}
                </div>
                <div className="text-lg font-black text-[#F5D061] mt-0.5">
                  442 {lang === 'vi' ? 'Bàn Thắng Cùng Nhau' : 'Combined Goals'}
                </div>
              </div>
              <div className="bg-[#060913]/85 rounded-xl p-3.5 border border-[#D4AF37]/30">
                <div className="text-[11px] uppercase text-slate-400 font-bold">
                  {lang === 'vi' ? 'Tam Giác Tuyến Giữa CMK' : 'CMK Midfield Triangle'}
                </div>
                <div className="text-lg font-black text-sky-400 mt-0.5">
                  Casemiro • Modrić • Kroos
                </div>
              </div>
              <div className="bg-[#060913]/85 rounded-xl p-3.5 border border-[#D4AF37]/30">
                <div className="text-[11px] uppercase text-slate-400 font-bold">
                  {lang === 'vi' ? 'Tỷ Lệ Thắng Knock-out C1' : 'UCL Knockout Win Rate'}
                </div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">
                  100% (12/12 {lang === 'vi' ? 'Cặp Đấu' : 'Ties'})
                </div>
              </div>
              <div className="bg-[#060913]/85 rounded-xl p-3.5 border border-[#D4AF37]/30">
                <div className="text-[11px] uppercase text-slate-400 font-bold">
                  {lang === 'vi' ? 'Vua Phá Lưới C1 3 Mùa' : '3-Season UCL Top Scorer'}
                </div>
                <div className="text-lg font-black text-white mt-0.5">
                  CR7: 43 {lang === 'vi' ? 'Bàn (16 + 12 + 15)' : 'Goals'}
                </div>
              </div>
            </div>
          </div>

          {/* Part 2 Filter Bar: Three-Peat 18 Squad vs Other Eras vs All 42 Legends */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLegendEraFilter('three_peat')}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                  legendEraFilter === 'three_peat'
                    ? 'bg-[#D4AF37] text-[#060913] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                    : 'bg-[#0D1326] text-slate-300 border border-white/10 hover:border-[#D4AF37]/50'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>
                  {lang === 'vi'
                    ? 'Đội Hình Huyền Thoại Ăn 3 C1 (2015–2018) (18)'
                    : 'Three-Peat UCL Dynasty Squad (2015–2018) (18)'}
                </span>
              </button>

              <button
                onClick={() => setLegendEraFilter('other_eras')}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                  legendEraFilter === 'other_eras'
                    ? 'bg-[#D4AF37] text-[#060913] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                    : 'bg-[#0D1326] text-slate-300 border border-white/10 hover:border-[#D4AF37]/50'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>
                  {lang === 'vi'
                    ? 'Huyền Thoại Các Thời Kỳ Khác (1902–2014) (24)'
                    : 'Legends of Other Golden Eras (24)'}
                </span>
              </button>

              <button
                onClick={() => setLegendEraFilter('all_legends')}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                  legendEraFilter === 'all_legends'
                    ? 'bg-[#D4AF37] text-[#060913] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                    : 'bg-[#0D1326] text-slate-300 border border-white/10 hover:border-[#D4AF37]/50'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>
                  {lang === 'vi' ? 'Toàn Bộ Đại Sảnh Huyền Thoại (42)' : 'All-Time Legends (42)'}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center bg-[#0D1326] p-1 rounded-xl border border-white/10">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37] ml-2 mr-1" />
                {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setLegendPosFilter(pos)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                      legendPosFilter === pos
                        ? 'bg-[#16203D] text-[#F5D061] border border-[#D4AF37]/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={legendSearch}
                  onChange={(e) => setLegendSearch(e.target.value)}
                  placeholder={
                    lang === 'vi'
                      ? 'Tìm Huyền thoại (CR7, Ramos, Isco)...'
                      : 'Search Legends (CR7, Ramos, Isco)...'
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D1326] border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F5D061]"
                />
              </div>
            </div>
          </div>

          {/* Part 2 Grid: Three-Peat UCL Dynasty & All-Time Legends Cards */}
          <div
            key={`part2-${sectionTab}-${legendEraFilter}-${legendPosFilter}`}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {legendPlayers.map((player, idx) =>
              renderPlayerCard(player, THREE_PEAT_UCL_IDS.includes(player.id), idx)
            )}
          </div>
        </div>
      )}
        </>
      )}

      {/* 2-COLUMN PLAYER PROFILE MODAL */}
      {modalPlayer && (
        <PlayerWalkoutModal
          player={modalPlayer}
          lang={lang}
          onClose={() => setModalPlayer(null)}
        />
      )}
    </section>
  );
};
