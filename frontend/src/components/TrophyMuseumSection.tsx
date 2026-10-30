import React, { useEffect, useState } from 'react';
import {
  Activity,
  Award,
  Compass,
  Crosshair,
  Eye,
  Flame,
  GitBranch,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Trophy,
  UserCheck,
  Zap,
} from 'lucide-react';
import { ChampionsLeagueTitle, Language, PitchNode } from '../types/database';
import {
  FinalTacticalBlueprint,
  UCL_FINAL_TACTICS,
} from '../data/uclFinalTactics';
import { TiltCard } from './TiltCard';
import { AnimatedCounter } from './AnimatedCounter';

interface TrophyMuseumSectionProps {
  uclTitles: ChampionsLeagueTitle[];
  lang: Language;
}

type TacticalLayerMode = 'all' | 'heat' | 'network' | 'goals';

const MAJOR_HONOURS = [
  {
    code: 'UCL',
    count: 15,
    vi: 'Cúp C1 / Champions League (Kỷ lục Thế giới)',
    en: 'European Cup / UEFA Champions League (Record)',
  },
  {
    code: 'LIGA',
    count: 36,
    vi: 'Vô địch Quốc gia La Liga (Kỷ lục Tây Ban Nha)',
    en: 'La Liga Santander / EA Sports (Spanish Record)',
  },
  {
    code: 'WC',
    count: 9,
    vi: 'Cúp Liên lục địa & FIFA Club World Cup',
    en: 'Intercontinental Cup & FIFA Club World Cup',
  },
  {
    code: 'USC',
    count: 6,
    vi: 'Siêu Cúp Châu Âu (UEFA Super Cup)',
    en: 'UEFA Super Cup (European Record)',
  },
  {
    code: 'CDR',
    count: 20,
    vi: 'Cúp Nhà Vua Tây Ban Nha (Copa del Rey)',
    en: 'Copa del Rey (Spanish Royal Cup)',
  },
  {
    code: 'SUP',
    count: 13,
    vi: 'Siêu Cúp Tây Ban Nha (Supercopa de España)',
    en: 'Supercopa de España',
  },
];

function resolvePlayerRole(
  tactics: FinalTacticalBlueprint,
  node: PitchNode,
  idx: number,
  title: ChampionsLeagueTitle,
  lang: Language
): { roleTitle: string; duty: string } {
  const custom = tactics.playerRoles[idx];
  if (custom) {
    return {
      roleTitle: custom.roleTitle[lang],
      duty: custom.duty[lang],
    };
  }

  // Fallback intelligent tactical role based on pitch coordinates (x, y)
  if (node.y >= 84) {
    return {
      roleTitle:
        lang === 'vi'
          ? 'Chốt Chặn Khung Gỗ & Phát Động Tuyến Dưới'
          : 'Goalkeeper & First Build-Up Line',
      duty:
        lang === 'vi'
          ? `Chỉ huy hàng phòng ngự và bảo vệ khung thành Real Madrid trước ${title.opponent} trong trận Chung kết ${title.year} (${title.score}).`
          : `Commanded the penalty area and initiated build-up play against ${title.opponent} in the ${title.year} Final (${title.score}).`,
    };
  }

  if (node.y >= 64) {
    if (node.x <= 26) {
      return {
        roleTitle:
          lang === 'vi'
            ? 'Hậu Vệ Biên Trái Dâng Cao (Overlapping LB)'
            : 'Overlapping Left Full-Back',
        duty:
          lang === 'vi'
            ? `Kiểm soát hành lang trái, liên tục dâng cao chồng biên kéo giãn khối phòng ngự của ${title.opponent} trong sơ đồ ${tactics.formation}.`
            : `Controlled the left flank and provided overlapping width in the ${tactics.formation} system against ${title.opponent}.`,
      };
    }
    if (node.x >= 74) {
      return {
        roleTitle:
          lang === 'vi'
            ? 'Hậu Vệ Biên Phải Công Thủ Toàn Diện (RB)'
            : 'Two-Way Right Full-Back',
        duty:
          lang === 'vi'
            ? `Khóa chặt mũi tấn công biên của ${title.opponent} và hỗ trợ tịnh tiến bóng dọc hành lang phải trong sơ đồ ${tactics.formation}.`
            : `Locked down the right defensive channel and supported flank progression in the ${tactics.formation} setup.`,
      };
    }
    return {
      roleTitle:
        lang === 'vi'
          ? 'Trung Vệ Thép & Chống Phản Công (CB)'
          : 'Central Defensive Anchor (CB)',
      duty:
        lang === 'vi'
          ? `Giữ cự ly khối phòng ngự, thắng tranh chấp tay đôi và bọc lót phía sau tuyến tiền vệ trước sức ép của ${title.opponent}.`
          : `Maintained defensive line compactness, won aerial duels, and initiated vertical passes into midfield.`,
    };
  }

  if (node.y >= 34) {
    return {
      roleTitle:
        lang === 'vi'
          ? 'Trục Luân Chuyển & Kiểm Soát Nhịp Độ Tuyến Giữa'
          : 'Midfield Tempo Controller & Connector',
      duty:
        lang === 'vi'
          ? `Mắt xích trọng yếu trong hệ thống ${tactics.formation} của HLV ${title.coach}, thoát pressing và cung cấp bóng cho tuyến đầu.`
          : `Key midfield connector in ${title.coach}’s ${tactics.formation}, linking defense to attack with high pass completion.`,
    };
  }

  return {
    roleTitle:
      lang === 'vi'
        ? 'Mũi Nhọn Tấn Công & Khoét Không Gian Vòng Cấm'
        : 'Attacking Spearhead & Box Threat',
    duty:
      lang === 'vi'
        ? `Liên tục di chuyển kéo giãn hàng thủ ${title.opponent}, phối hợp tốc độ cao trong vùng cấm địa ở trận Chung kết ${title.year}.`
        : `Stretched ${title.opponent}’s backline with sharp off-ball runs and box presence in the ${title.year} Final.`,
  };
}

export const TrophyMuseumSection: React.FC<TrophyMuseumSectionProps> = ({
  uclTitles,
  lang,
}) => {
  const [selectedEdition, setSelectedEdition] = useState<number>(15);
  const [layerMode, setLayerMode] = useState<TacticalLayerMode>('all');
  const [hoveredPlayerIdx, setHoveredPlayerIdx] = useState<number | null>(null);
  const [pinnedPlayerIdx, setPinnedPlayerIdx] = useState<number>(8);

  const activeTitle =
    uclTitles.find((t) => t.edition === selectedEdition) ??
    uclTitles[uclTitles.length - 1];

  const tactics: FinalTacticalBlueprint =
    UCL_FINAL_TACTICS[activeTitle.edition] ?? UCL_FINAL_TACTICS[15];

  useEffect(() => {
    setPinnedPlayerIdx(tactics.defaultSpotlightIdx);
    setHoveredPlayerIdx(null);
  }, [activeTitle.edition, tactics.defaultSpotlightIdx]);

  const activePlayerIdx = hoveredPlayerIdx ?? pinnedPlayerIdx;
  const activePlayerNode =
    activeTitle.lineup[activePlayerIdx] ?? activeTitle.lineup[0];
  const activePlayerRole = resolvePlayerRole(
    tactics,
    activePlayerNode,
    activePlayerIdx,
    activeTitle,
    lang
  );

  const showHeatZones = layerMode === 'all' || layerMode === 'heat';
  const showPassNetwork = layerMode === 'all' || layerMode === 'network';
  const showGoalVectors = layerMode === 'all' || layerMode === 'goals';

  return (
    <section
      id="museum"
      className="heavy-section-deferred py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-semibold uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi'
                ? 'Phân Hệ 2 • Phòng Truyền Thống Hoàng Gia & Sa Bàn Chung Kết'
                : 'Module 2 • 3D Virtual Trophy Room & Tactical Pitch'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'vi'
              ? 'BẢO TÀNG DANH HIỆU & GIẢI MÃ CHIẾN THUẬT 15 CHUNG KẾT C1'
              : 'VIRTUAL TROPHY MUSEUM & 15 UCL FINALS TACTICAL LAB'}
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-xl">
          {lang === 'vi'
            ? 'Chọn bất kỳ chiếc Cúp C1 nào (1956–2024) để khám phá 3 lớp đồ họa chiến thuật: Vùng nhiệt áp đảo, Mạng lưới luân chuyển bóng có trọng số và Đường chuyền kiến tạo bàn thắng quyết định.'
            : 'Select any European Cup / UCL Final (1956–2024) to explore 3 tactical layers: Labeled Heat Zones, Weighted Passing Network, and Decisive Goal/Assist Vectors.'}
        </p>
      </div>

      {/* Major Honours Cabinet with 3D Tilt & Animated Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-10">
        {MAJOR_HONOURS.map((item, idx) => (
          <TiltCard
            key={item.code}
            style={{ '--stagger-delay': `${idx * 45}ms` } as React.CSSProperties}
            className="glass-royal royal-card-hover animate-card-stagger rounded-2xl p-4 text-center hover:border-[#F5D061]"
          >
            <div className="text-3xl font-black text-[#F5D061]">
              <AnimatedCounter value={item.count} />
            </div>
            <div className="text-[11px] font-semibold text-slate-300 mt-1 leading-snug">
              {lang === 'vi' ? item.vi : item.en}
            </div>
          </TiltCard>
        ))}
      </div>

      {/* 15 European Cups Interactive Carousel Strip */}
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-[#F5D061] mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 fill-[#F5D061]" />
          <span>
            {lang === 'vi'
              ? 'Chọn Chiếc Cúp C1 / Champions League Để Phân Tích Sa Bàn Trận Chung Kết:'
              : 'Select a European Cup / UCL Title to Inspect the Final Tactical Blueprint:'}
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-15 gap-2">
          {uclTitles.map((cup) => {
            const isSelected = cup.edition === activeTitle?.edition;
            return (
              <TiltCard
                key={cup.edition}
                maxTiltDeg={12}
                onClick={() => setSelectedEdition(cup.edition)}
                className={`royal-card-hover cursor-pointer flex flex-col items-center justify-center p-2.5 rounded-xl border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#D4AF37]/35 to-[#16203D] border-[#F5D061] shadow-[0_0_20px_rgba(212,175,55,0.35)] -translate-y-0.5'
                    : 'bg-[#0D1326] border-white/10 hover:border-[#D4AF37]/50'
                }`}
              >
                <Trophy
                  className={`w-5 h-5 mb-1 transition-transform duration-200 ease-spring-subtle ${
                    isSelected ? 'text-[#F5D061] scale-110' : 'text-slate-400'
                  }`}
                />
                <span className="text-[11px] font-extrabold text-white">
                  #{cup.edition}
                </span>
                <span className="text-[10px] font-bold text-[#D4AF37]">
                  {cup.year}
                </span>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Selected UCL Final Details + 2D Tactical Pitch with 3 Interactive Layers */}
      {activeTitle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left Column (5 Cols): Match Dossier + 3-Bullet Tactical Breakdown */}
          <div
            key={activeTitle.edition}
            className="lg:col-span-5 space-y-5 animate-section-reveal"
          >
            <div className="glass-royal rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5D061] text-xs font-extrabold">
                  CÚP #{activeTitle.edition} • {activeTitle.year}
                </span>
                <span className="text-xs font-extrabold text-[#F5D061] tracking-wider uppercase">
                  {activeTitle.titleName}
                </span>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  {lang === 'vi' ? 'Kết Quả Chung Kết' : 'Final Scoreline'}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Real Madrid{' '}
                  <span className="text-[#F5D061]">{activeTitle.score}</span>{' '}
                  {activeTitle.opponent}
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeTitle.story[lang]}
              </p>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-slate-400">
                    {lang === 'vi' ? 'Sân vận động:' : 'Venue:'}
                  </span>
                  <span className="font-bold text-white">
                    {activeTitle.venue[lang]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <UserCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-slate-400">
                    {lang === 'vi' ? 'HLV Trưởng:' : 'Head Coach:'}
                  </span>
                  <span className="font-bold text-white">
                    {activeTitle.coach}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Compass className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-slate-400">
                    {lang === 'vi' ? 'Sơ đồ chiến thuật:' : 'Tactical System:'}
                  </span>
                  <span className="font-extrabold text-emerald-400">
                    {tactics.formation}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-slate-400">
                    {lang === 'vi'
                      ? 'Cầu thủ xuất sắc nhất:'
                      : 'Final Hero / MVP:'}
                  </span>
                  <span className="font-bold text-[#F5D061]">
                    {activeTitle.mvp}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {lang === 'vi'
                    ? 'Danh sách ghi bàn của Real Madrid:'
                    : 'Real Madrid Goalscorers:'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeTitle.scorers.map((scorer) => (
                    <span
                      key={scorer}
                      className="px-2.5 py-1 rounded-md bg-[#16203D] border border-[#D4AF37]/40 text-xs font-bold text-[#F5D061]"
                    >
                      ⚽ {scorer}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* KHUNG "GIẢI MÃ CHIẾN THUẬT TRẬN CHUNG KẾT" (3 GẠCH ĐẦU DÒNG CHUYÊN SÂU) */}
            <div className="glass-royal rounded-2xl p-5 sm:p-6 border border-[#D4AF37]/45 space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#F5D061]">
                  <Activity className="w-4 h-4 text-[#F5D061]" />
                  <span>
                    {lang === 'vi'
                      ? `Giải Mã Chiến Thuật Chung Kết ${activeTitle.year}`
                      : `${activeTitle.year} Final Tactical Breakdown`}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#16203D] border border-[#D4AF37]/40 text-[11px] font-extrabold text-emerald-400">
                  {tactics.formation}
                </span>
              </div>

              <ul className="space-y-3 text-xs leading-relaxed">
                <li className="p-3 rounded-xl bg-[#0D1326]/90 border border-white/10">
                  <div className="font-extrabold text-[#F5D061] uppercase text-[11px] mb-0.5 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {lang === 'vi'
                        ? '1. Cấu trúc đội hình & Ý đồ kiểm soát:'
                        : '1. Formation Structure & Control Plan:'}
                    </span>
                  </div>
                  <p className="text-slate-200">{tactics.breakdown.structure[lang]}</p>
                </li>

                <li className="p-3 rounded-xl bg-[#0D1326]/90 border border-white/10">
                  <div className="font-extrabold text-sky-400 uppercase text-[11px] mb-0.5 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {lang === 'vi'
                        ? '2. Điểm nổ chiến thuật (Tactical Overload):'
                        : '2. Key Tactical Overload Zone:'}
                    </span>
                  </div>
                  <p className="text-slate-200">{tactics.breakdown.overload[lang]}</p>
                </li>

                <li className="p-3 rounded-xl bg-[#0D1326]/90 border border-white/10">
                  <div className="font-extrabold text-emerald-400 uppercase text-[11px] mb-0.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {lang === 'vi'
                        ? '3. Đòn kết liễu định đoạt trận đấu:'
                        : '3. Match-Winning Finishing Sequence:'}
                    </span>
                  </div>
                  <p className="text-slate-200">{tactics.breakdown.finisher[lang]}</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column (7 Cols): 2D Multi-Layer Tactical Pitch + Layer Controls + Role Dossier */}
          <div className="lg:col-span-7 space-y-4">
            <div className="keep-dark-surface bg-[#071912] rounded-2xl border-2 border-[#D4AF37]/55 p-3.5 sm:p-5 relative overflow-hidden shadow-2xl space-y-3">
              {/* TOP PITCH BANNER: TITLE + FORMATION BADGE + HEAD COACH */}
              <div
                style={{
                  backgroundColor: '#0B1120',
                  color: '#F5D061',
                  borderColor: '#D4AF37',
                }}
                className="pitch-top-banner relative z-20 flex flex-wrap items-center justify-between gap-2 text-xs px-3.5 py-2.5 rounded-xl border shadow-lg"
              >
                <div className="flex items-center gap-2 font-extrabold">
                  <Shield className="w-4 h-4 text-[#F5D061] shrink-0" />
                  <span style={{ color: '#F5D061' }}>
                    {activeTitle.titleName} ({activeTitle.year}) —{' '}
                    {lang === 'vi'
                      ? 'ĐỘI HÌNH CHIẾN THUẬT CHUNG KẾT'
                      : 'TACTICAL GLOW XI'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      backgroundColor: '#16203D',
                      color: '#34D399',
                      borderColor: 'rgba(52,211,153,0.45)',
                    }}
                    className="px-2 py-0.5 rounded-md border text-[11px] font-black"
                  >
                    {lang === 'vi' ? 'Sơ đồ:' : 'System:'} {tactics.formation}
                  </span>
                  <span style={{ color: '#FFFFFF' }} className="font-extrabold">
                    {lang === 'vi' ? 'HLV:' : 'Coach:'} {activeTitle.coach}
                  </span>
                </div>
              </div>

              {/* 2D TACTICAL PITCH CANVAS */}
              <div className="relative w-full h-[430px] sm:h-[460px] rounded-xl overflow-hidden bg-gradient-to-b from-[#0A261B] via-[#071D14] to-[#05150E] border border-[#D4AF37]/35 select-none">
                {/* SVG LAYER: PITCH LINES + HEAT ZONES + PASSING NETWORK + GOAL VECTORS + RUN ARROWS */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <defs>
                    {/* 3 Multi-Stop Radial Gradients for Tactical Heat Zones */}
                    <radialGradient id="heatZoneCrimson" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(244, 63, 94, 0.46)" />
                      <stop offset="55%" stopColor="rgba(245, 158, 11, 0.22)" />
                      <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
                    </radialGradient>
                    <radialGradient id="heatZoneGold" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(245, 208, 97, 0.44)" />
                      <stop offset="55%" stopColor="rgba(212, 175, 55, 0.18)" />
                      <stop offset="100%" stopColor="rgba(245, 208, 97, 0)" />
                    </radialGradient>
                    <radialGradient id="heatZoneCyan" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(56, 189, 248, 0.42)" />
                      <stop offset="55%" stopColor="rgba(16, 185, 129, 0.16)" />
                      <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                    </radialGradient>

                    {/* Arrowhead Marker for Key Assist / Goal Vectors */}
                    <marker
                      id="goalArrowMarker"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="4.2"
                      markerHeight="4.2"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#10B981" />
                    </marker>

                    {/* Arrowhead Marker for Off-Ball Tactical Runs */}
                    <marker
                      id="tacticalRunMarker"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="3.5"
                      markerHeight="3.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="#38BDF8" />
                    </marker>
                  </defs>

                  {/* Pitch Turf Stripes */}
                  {[0, 20, 40, 60, 80].map((yStripe) => (
                    <rect
                      key={yStripe}
                      x="3"
                      y={yStripe + 3}
                      width="94"
                      height="10"
                      fill="rgba(255, 255, 255, 0.015)"
                    />
                  ))}

                  {/* Standard Pitch Geometry Lines (Attacking Direction: Bottom -> Top) */}
                  <rect
                    x="3"
                    y="3"
                    width="94"
                    height="94"
                    fill="none"
                    stroke="rgba(245,208,97,0.34)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="3"
                    y1="50"
                    x2="97"
                    y2="50"
                    stroke="rgba(245,208,97,0.28)"
                    strokeWidth="0.45"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="11.5"
                    fill="none"
                    stroke="rgba(245,208,97,0.28)"
                    strokeWidth="0.45"
                  />
                  <circle cx="50" cy="50" r="0.8" fill="rgba(245,208,97,0.45)" />
                  {/* Opponent Penalty Area (Top) */}
                  <rect
                    x="22"
                    y="3"
                    width="56"
                    height="15"
                    fill="none"
                    stroke="rgba(245,208,97,0.32)"
                    strokeWidth="0.45"
                  />
                  <rect
                    x="35"
                    y="3"
                    width="30"
                    height="6"
                    fill="none"
                    stroke="rgba(245,208,97,0.25)"
                    strokeWidth="0.4"
                  />
                  {/* Real Madrid Penalty Area (Bottom) */}
                  <rect
                    x="22"
                    y="82"
                    width="56"
                    height="15"
                    fill="none"
                    stroke="rgba(245,208,97,0.32)"
                    strokeWidth="0.45"
                  />
                  <rect
                    x="35"
                    y="91"
                    width="30"
                    height="6"
                    fill="none"
                    stroke="rgba(245,208,97,0.25)"
                    strokeWidth="0.4"
                  />

                  {/* LAYER 1: LABELED MULTI-CONTOUR TACTICAL HEAT ZONES */}
                  {showHeatZones &&
                    tactics.heatZones.map((zone) => {
                      const gradId =
                        zone.tone === 'crimson'
                          ? 'url(#heatZoneCrimson)'
                          : zone.tone === 'gold'
                          ? 'url(#heatZoneGold)'
                          : 'url(#heatZoneCyan)';
                      const strokeColor =
                        zone.tone === 'crimson'
                          ? 'rgba(244, 63, 94, 0.55)'
                          : zone.tone === 'gold'
                          ? 'rgba(245, 208, 97, 0.55)'
                          : 'rgba(56, 189, 248, 0.55)';
                      return (
                        <g key={zone.id}>
                          <ellipse
                            cx={zone.cx}
                            cy={zone.cy}
                            rx={zone.rx}
                            ry={zone.ry}
                            fill={gradId}
                          />
                          <ellipse
                            cx={zone.cx}
                            cy={zone.cy}
                            rx={zone.rx * 0.78}
                            ry={zone.ry * 0.78}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="0.35"
                            strokeDasharray="1.4 1.2"
                          />
                        </g>
                      );
                    })}

                  {/* LAYER 2A: WEIGHTED PASSING NETWORK & OFF-BALL TACTICAL RUNS */}
                  {showPassNetwork &&
                    tactics.passLinks.map((link, idx) => {
                      const fromNode = activeTitle.lineup[link.fromIdx];
                      const toNode = activeTitle.lineup[link.toIdx];
                      if (!fromNode || !toNode) return null;

                      const isConnectedToActive =
                        activePlayerIdx === link.fromIdx ||
                        activePlayerIdx === link.toIdx;

                      const baseWidth =
                        link.weight === 3
                          ? 0.85
                          : link.weight === 2
                          ? 0.6
                          : 0.42;

                      return (
                        <g key={`pass-${idx}`}>
                          {/* Base Weighted Connection Line */}
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={
                              isConnectedToActive
                                ? 'rgba(245, 208, 97, 0.92)'
                                : 'rgba(226, 232, 240, 0.28)'
                            }
                            strokeWidth={
                              isConnectedToActive ? baseWidth + 0.35 : baseWidth
                            }
                          />
                          {/* Animated Flowing Pass Pulse */}
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={
                              isConnectedToActive
                                ? '#F5D061'
                                : 'rgba(245, 208, 97, 0.58)'
                            }
                            strokeWidth={isConnectedToActive ? 0.95 : 0.5}
                            className="animate-pitch-flow"
                          />
                        </g>
                      );
                    })}

                  {/* Off-Ball Tactical Movement Arrows */}
                  {showPassNetwork &&
                    tactics.tacticalRuns.map((run, idx) => {
                      const isPlayerActive = activePlayerIdx === run.playerIdx;
                      return (
                        <line
                          key={`run-${idx}`}
                          x1={run.fromX}
                          y1={run.fromY}
                          x2={run.toX}
                          y2={run.toY}
                          stroke={
                            isPlayerActive
                              ? '#38BDF8'
                              : 'rgba(56, 189, 248, 0.75)'
                          }
                          strokeWidth={isPlayerActive ? '0.75' : '0.55'}
                          strokeDasharray="1.5 1.2"
                          markerEnd="url(#tacticalRunMarker)"
                        />
                      );
                    })}

                  {/* LAYER 2B: KEY ASSIST & GOAL VECTORS (CURVED BÉZIER ARROWS) */}
                  {showGoalVectors &&
                    tactics.goalVectors.map((vec) => {
                      const isVectorHighlighted =
                        activePlayerIdx === vec.fromIdx ||
                        activePlayerIdx === vec.toIdx;
                      const pathD = `M ${vec.fromX} ${vec.fromY} Q ${vec.ctrlX} ${vec.ctrlY} ${vec.toX} ${vec.toY}`;
                      return (
                        <g key={vec.id}>
                          {/* Outer Emerald Glow */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke="rgba(16, 185, 129, 0.35)"
                            strokeWidth={isVectorHighlighted ? '2.2' : '1.6'}
                          />
                          {/* Main Curved Goal Assist Arrow */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#10B981"
                            strokeWidth={isVectorHighlighted ? '1.15' : '0.85'}
                            markerEnd="url(#goalArrowMarker)"
                          />
                        </g>
                      );
                    })}
                </svg>

                {/* HTML OVERLAY LAYER 1: CRISP HEAT ZONE LABELS */}
                {showHeatZones &&
                  tactics.heatZones.map((zone) => {
                    const borderTone =
                      zone.tone === 'crimson'
                        ? 'rgba(244, 63, 94, 0.7)'
                        : zone.tone === 'gold'
                        ? 'rgba(245, 208, 97, 0.7)'
                        : 'rgba(56, 189, 248, 0.7)';
                    const textTone =
                      zone.tone === 'crimson'
                        ? '#FDA4AF'
                        : zone.tone === 'gold'
                        ? '#FDE68A'
                        : '#7DD3FC';
                    return (
                      <div
                        key={`hz-label-${zone.id}`}
                        style={{
                          left: `${zone.cx}%`,
                          top: `${Math.max(8, Math.min(92, zone.cy - zone.ry * 0.55))}%`,
                          backgroundColor: 'rgba(6, 11, 24, 0.82)',
                          borderColor: borderTone,
                          color: textTone,
                        }}
                        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md border text-[9px] sm:text-[10px] font-extrabold tracking-tight whitespace-nowrap shadow-md"
                      >
                        🔥 {zone.label[lang]}
                      </div>
                    );
                  })}

                {/* HTML OVERLAY LAYER 2B: CRISP GOAL / ASSIST MINUTE LABELS */}
                {showGoalVectors &&
                  tactics.goalVectors.map((vec) => {
                    const midX =
                      0.25 * vec.fromX + 0.5 * vec.ctrlX + 0.25 * vec.toX;
                    const midY =
                      0.25 * vec.fromY + 0.5 * vec.ctrlY + 0.25 * vec.toY;
                    return (
                      <div
                        key={`gv-label-${vec.id}`}
                        style={{
                          left: `${midX}%`,
                          top: `${midY}%`,
                          backgroundColor: '#042F2E',
                          borderColor: '#10B981',
                          color: '#6EE7B7',
                        }}
                        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full border text-[9.5px] sm:text-[10px] font-black whitespace-nowrap shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      >
                        ⚡ {vec.label[lang]}
                      </div>
                    );
                  })}

                {/* LAYER 3: 11 INTERACTIVE PLAYER NODES ON 2D PITCH */}
                {activeTitle.lineup.map((node, idx) => {
                  const isFocused = activePlayerIdx === idx;
                  const hasCustomHighlight = Boolean(tactics.playerRoles[idx]);
                  return (
                    <div
                      key={`${activeTitle.edition}-${idx}`}
                      onMouseEnter={() => setHoveredPlayerIdx(idx)}
                      onMouseLeave={() => setHoveredPlayerIdx(null)}
                      onClick={() => setPinnedPlayerIdx(idx)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className={`pitch-node-glide absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer ${
                        isFocused ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                      }`}
                    >
                      <div
                        style={{
                          backgroundColor: isFocused ? '#F5D061' : '#FFFFFF',
                          color: '#0F172A',
                          borderColor: isFocused
                            ? '#FFFFFF'
                            : hasCustomHighlight
                            ? '#F5D061'
                            : '#D4AF37',
                        }}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-black text-xs transition-all duration-200 ${
                          isFocused
                            ? 'ring-4 ring-[#F5D061]/45 shadow-[0_0_24px_rgba(245,208,97,0.95)]'
                            : 'shadow-[0_0_16px_rgba(245,208,97,0.55)]'
                        }`}
                      >
                        {node.number}
                      </div>
                      <span
                        style={{
                          backgroundColor: isFocused ? '#D4AF37' : '#0B1120',
                          color: isFocused ? '#060913' : '#FFFFFF',
                          borderColor: '#D4AF37',
                        }}
                        className="pitch-node-badge mt-1 px-2 py-0.5 rounded-md border text-[10px] sm:text-[11px] font-extrabold whitespace-nowrap shadow"
                      >
                        {node.name}
                      </span>
                    </div>
                  );
                })}

                {/* Attacking Direction Indicator on Left Pitch Edge */}
                <div
                  style={{
                    backgroundColor: 'rgba(11, 17, 32, 0.78)',
                    color: '#F5D061',
                    borderColor: 'rgba(212, 175, 55, 0.4)',
                  }}
                  className="pointer-events-none absolute bottom-2.5 right-2.5 z-20 px-2.5 py-1 rounded-lg border text-[10px] font-extrabold"
                >
                  {lang === 'vi'
                    ? '▲ Hướng tấn công của Real Madrid'
                    : '▲ Real Madrid Attacking Direction'}
                </div>
              </div>

              {/* INTERACTIVE PLAYER ROLE POPOVER CARD (UPDATES ON HOVER / CLICK) */}
              {activePlayerNode && (
                <div
                  style={{
                    backgroundColor: '#0B1120',
                    borderColor: 'rgba(212, 175, 55, 0.6)',
                  }}
                  className="rounded-xl p-3.5 border shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        style={{
                          backgroundColor: '#D4AF37',
                          color: '#060913',
                        }}
                        className="px-2 py-0.5 rounded-md text-[11px] font-black"
                      >
                        #{activePlayerNode.number} {activePlayerNode.name}
                      </span>
                      <span
                        style={{ color: '#F5D061' }}
                        className="text-xs font-extrabold uppercase tracking-wide"
                      >
                        {activePlayerRole.roleTitle}
                      </span>
                    </div>
                    <p
                      style={{ color: '#E2E8F0' }}
                      className="text-xs leading-relaxed"
                    >
                      {activePlayerRole.duty}
                    </p>
                  </div>
                  <div
                    style={{ color: '#94A3B8' }}
                    className="text-[10px] font-bold shrink-0 sm:text-right"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F5D061] inline mr-1" />
                    {lang === 'vi'
                      ? 'Rê chuột hoặc bấm vào cầu thủ trên sân để xem vai trò'
                      : 'Hover or click any player node on pitch'}
                  </div>
                </div>
              )}

              {/* 1. THANH NÚT BẬT/TẮT LỚP ĐỒ HỌA (LAYER TOGGLES) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      {
                        id: 'all',
                        icon: Eye,
                        vi: '👁️ Tất cả lớp',
                        en: '👁️ All Layers',
                      },
                      {
                        id: 'heat',
                        icon: Flame,
                        vi: '🔥 Vùng nhiệt áp đảo',
                        en: '🔥 Heat Zones',
                      },
                      {
                        id: 'network',
                        icon: GitBranch,
                        vi: '🔗 Mạng lưới luân chuyển',
                        en: '🔗 Passing Network',
                      },
                      {
                        id: 'goals',
                        icon: Crosshair,
                        vi: '⚡ Đường chuyền bàn thắng',
                        en: '⚡ Goal Vectors',
                      },
                    ] as const
                  ).map((btn) => {
                    const active = layerMode === btn.id;
                    return (
                      <button
                        key={btn.id}
                        onClick={() => setLayerMode(btn.id)}
                        style={{
                          backgroundColor: active ? '#D4AF37' : '#0B1120',
                          color: active ? '#060913' : '#E2E8F0',
                          borderColor: active
                            ? '#F5D061'
                            : 'rgba(212, 175, 55, 0.35)',
                        }}
                        className="px-3 py-1.5 rounded-xl border text-[11px] font-extrabold transition-all shadow-sm"
                      >
                        {lang === 'vi' ? btn.vi : btn.en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. THANH CHÚ GIẢI TRỰC QUAN (VISUAL LEGEND) */}
              <div
                style={{
                  backgroundColor: '#0B1120',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#E2E8F0',
                }}
                className="rounded-xl px-3.5 py-2.5 border grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10.5px] font-bold"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-sky-400 inline-block shrink-0 border border-white/40" />
                  <span>
                    {lang === 'vi'
                      ? 'Vùng nhiệt trọng điểm'
                      : 'Tactical Heat Zone'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-1 rounded-full bg-[#F5D061] inline-block shrink-0" />
                  <span>
                    {lang === 'vi'
                      ? 'Trục luân chuyển bóng'
                      : 'Weighted Pass Link'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-1 rounded-full bg-emerald-400 inline-block shrink-0" />
                  <span>
                    {lang === 'vi'
                      ? 'Kiến tạo / Bàn thắng (⚡)'
                      : 'Key Assist / Goal (⚡)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-0.5 border-b-2 border-dashed border-sky-400 inline-block shrink-0" />
                  <span>
                    {lang === 'vi'
                      ? 'Di chuyển không bóng'
                      : 'Off-Ball Tactical Run'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
