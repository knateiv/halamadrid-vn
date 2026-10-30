import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  Gauge,
  Shield,
  Trophy,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';
import { Language, PlayerProfile } from '../types/database';
import { PlayerAvatar } from './PlayerAvatar';
import { AnimatedCounter } from './AnimatedCounter';
import { CountryFlag } from './CountryFlag';

interface PlayerWalkoutModalProps {
  player: PlayerProfile;
  lang: Language;
  onClose: () => void;
}

const MODAL_RADAR_AXES: Array<{
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

export const PlayerWalkoutModal: React.FC<PlayerWalkoutModalProps> = ({
  player,
  lang,
  onClose,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // Lock background page scroll, bind Escape key & trigger Radar/Progress Bar reveal
  useEffect(() => {
    setIsRevealed(false);
    const rafId = window.requestAnimationFrame(() => {
      setIsRevealed(true);
    });

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, player.id]);

  // Compute SVG Polygon Points for 6-Axis Radar in Right Column
  const getRadarPolygonPoints = (radius = 80, center = 110) => {
    return MODAL_RADAR_AXES.map((axis, idx) => {
      const angle = (Math.PI * 2 * idx) / MODAL_RADAR_AXES.length - Math.PI / 2;
      const val = (player.radarPercentiles[axis.key] ?? 50) / 100;
      const r = val * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  const infoGridItems = [
    {
      labelVi: 'Họ và tên',
      labelEn: 'Full Name',
      value: player.fullName ?? player.name,
      highlight: true,
    },
    {
      labelVi: 'Ngày sinh / Tuổi',
      labelEn: 'Date of Birth / Age',
      value: player.birthDateAndAge?.[lang] ?? player.birthDate,
    },
    {
      labelVi: 'Quốc tịch',
      labelEn: 'Nationality',
      value: (
        <span className="inline-flex items-center">
          <CountryFlag nationality={player.nationality} />
          <span>{player.nationality[lang]}</span>
        </span>
      ),
    },
    {
      labelVi: 'Câu lạc bộ',
      labelEn: 'Club',
      value:
        player.clubName?.[lang] ??
        (player.category === 'squad_2026_27'
          ? 'Real Madrid CF'
          : `Real Madrid CF (${player.era})`),
    },
    {
      labelVi: 'Số áo',
      labelEn: 'Shirt Number',
      value: `#${player.shirtNumber}`,
      gold: true,
    },
    {
      labelVi: 'Vị trí',
      labelEn: 'Position',
      value: `${player.positionGroup} • ${player.specificPositions.join('/')}`,
    },
    {
      labelVi: 'Chiều cao',
      labelEn: 'Height',
      value: player.height ?? '1,82 m',
    },
    {
      labelVi: 'Cân nặng',
      labelEn: 'Weight',
      value: player.weight ?? '76 kg',
    },
    {
      labelVi: 'Chân thuận',
      labelEn: 'Preferred Foot',
      value: player.preferredFoot?.[lang] ?? (lang === 'vi' ? 'Chân phải' : 'Right foot'),
    },
    {
      labelVi: 'Giá trị thị trường',
      labelEn: 'Market Value',
      value: player.marketValue,
      emerald: true,
    },
  ];

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-modal-backdrop"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="profile-modal-surface animate-modal-panel relative w-full max-w-6xl max-h-[92vh] rounded-3xl overflow-y-auto transition-colors duration-300"
      >
        {/* Sticky Top Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-[#D4AF37]/35 bg-inherit backdrop-blur-md">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#060913] font-extrabold text-xs uppercase tracking-wider whitespace-nowrap">
              {lang === 'vi' ? 'HỒ SƠ CHI TIẾT CẦU THỦ' : 'OFFICIAL PLAYER PROFILE'}
            </span>
            <span className="hidden sm:inline-block text-xs font-extrabold profile-modal-gold whitespace-nowrap">
              {`#${player.shirtNumber} • ${(player.fullName ?? player.name).toUpperCase()}`}
            </span>
            {player.id === 'federico-valverde' && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                {lang === 'vi' ? '(C) ĐỘI TRƯỞNG' : '(C) CAPTAIN'}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#D4AF37]/20 hover:bg-rose-500/25 profile-modal-title transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-COLUMN SPLIT PROFILE LAYOUT: LEFT = AVATAR | RIGHT = 12-ITEM BIO TABLE, STATS & 6-AXIS RADAR */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
          {/* BÊN TRÁI (LEFT COLUMN - MỤC 1: ẢNH ĐẠI DIỆN CẦU THỦ LỚN SẮC NÉT) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:sticky lg:top-16">
            <div className="keep-dark-surface relative w-full max-w-[340px] h-[420px] sm:h-[470px] rounded-2xl overflow-hidden border-2 border-[#D4AF37] bg-[#060913] shadow-2xl">
              <PlayerAvatar
                src={player.imageUrl}
                name={player.name}
                shirtNumber={player.shirtNumber}
                position={player.specificPositions.join('/')}
                priority
                className="w-full h-full object-cover object-[center_top]"
              />

              {/* Top Left Category Pill */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#060913]/85 border border-[#D4AF37]/60 text-[#F5D061] font-extrabold text-[11px] uppercase tracking-wider shadow whitespace-nowrap">
                {player.category === 'squad_2026_27'
                  ? lang === 'vi'
                    ? 'Đội Hình 2026/27'
                    : 'Squad 2026/27'
                  : lang === 'vi'
                  ? 'Huyền Thoại'
                  : 'All-Time Legend'}
              </div>

              {/* Top Right Shirt Number */}
              <div className="absolute top-3 right-3 px-3.5 py-1 rounded-xl bg-[#D4AF37] text-[#060913] font-extrabold text-sm shadow-lg whitespace-nowrap">
                #{player.shirtNumber}
              </div>

              {/* Bottom Player Identity Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#060913] via-[#060913]/90 to-transparent p-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/25 border border-[#F5D061] text-[#F5D061] text-[11px] font-extrabold uppercase tracking-wider mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>REAL MADRID CF</span>
                </div>
                <div className="text-xl font-black text-white flex items-center justify-center gap-2 flex-wrap">
                  <span className="truncate">{player.name}</span>
                  {player.id === 'federico-valverde' && (
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                      {lang === 'vi' ? '(C) ĐỘI TRƯỞNG' : '(C) CAPTAIN'}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-300 mt-0.5 flex items-center justify-center flex-wrap">
                  <CountryFlag nationality={player.nationality} />
                  <span>
                    {player.nationality[lang]} • {player.positionGroup} • {player.specificPositions.join('/')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BÊN PHẢI (RIGHT COLUMN): BẢNG 12 THÔNG TIN GIỚI THIỆU, THỐNG KÊ & BIỂU ĐỒ RADAR 6 TRỤC */}
          <div className="lg:col-span-8 space-y-4">
            {/* SECTION A: BẢNG LƯỚI 12 MỤC THÔNG TIN GIỚI THIỆU CẦU THỦ */}
            <div className="profile-modal-box rounded-2xl p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#D4AF37]/25">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-base sm:text-lg font-black profile-modal-title uppercase tracking-wide">
                    {lang === 'vi'
                      ? 'Thông Tin Giới Thiệu Cầu Thủ (Hồ Sơ Chuẩn)'
                      : 'Official Player Biographical & Physical Profile'}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#D4AF37]/20 profile-modal-gold text-xs font-extrabold">
                  {player.era}
                </span>
              </div>

              {/* 10-Field Structured Grid (Items 2 to 11) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {infoGridItems.map((item) => (
                  <div
                    key={item.labelVi}
                    className="p-2.5 sm:p-3 rounded-xl border border-[#D4AF37]/20 bg-white/50 dark:bg-white/[0.03] flex flex-col justify-center"
                  >
                    <div className="text-[10px] uppercase font-bold profile-modal-muted tracking-wider">
                      {lang === 'vi' ? item.labelVi : item.labelEn}
                    </div>
                    <div
                      className={`text-xs sm:text-sm mt-0.5 font-extrabold leading-snug ${
                        item.gold
                          ? 'profile-modal-gold text-base'
                          : item.emerald
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : item.highlight
                          ? 'profile-modal-title text-sm sm:text-base'
                          : 'profile-modal-title'
                      }`}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Item 12: Tiểu sử ngắn & Danh sách các CLB từng thi đấu */}
              <div className="p-3.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06] space-y-1.5">
                <div className="text-[11px] uppercase font-extrabold profile-modal-gold tracking-wider">
                  {lang === 'vi'
                    ? 'Tiểu Sử Ngắn & Sự Nghiệp Các Câu Lạc Bộ:'
                    : 'Short Biography & Club Career Trajectory:'}
                </div>
                <p className="text-xs sm:text-sm profile-modal-body leading-relaxed font-medium">
                  {player.bio[lang]}
                </p>
              </div>
            </div>

            {/* SECTION B: THỐNG KÊ SỰ NGHIỆP TẠI REAL MADRID (6 COUNTERS) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div className="profile-modal-box p-2.5 rounded-xl text-center">
                <div className="text-[10px] uppercase profile-modal-muted font-bold">
                  {lang === 'vi' ? 'Số trận' : 'Matches'}
                </div>
                <AnimatedCounter
                  value={player.stats.appearances}
                  className="text-sm sm:text-base font-extrabold profile-modal-title"
                />
              </div>
              <div className="profile-modal-box p-2.5 rounded-xl text-center">
                <div className="text-[10px] uppercase profile-modal-muted font-bold">
                  {lang === 'vi' ? 'Bàn thắng' : 'Goals'}
                </div>
                <AnimatedCounter
                  value={player.stats.goals}
                  className="text-sm sm:text-base font-extrabold profile-modal-gold"
                />
              </div>
              <div className="profile-modal-box p-2.5 rounded-xl text-center">
                <div className="text-[10px] uppercase profile-modal-muted font-bold">
                  {lang === 'vi' ? 'Kiến tạo' : 'Assists'}
                </div>
                <AnimatedCounter
                  value={player.stats.assists}
                  className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <div className="profile-modal-box p-2.5 rounded-xl text-center">
                <div className="text-[10px] uppercase profile-modal-muted font-bold">
                  {lang === 'vi' ? 'Danh hiệu' : 'Trophies'}
                </div>
                <div className="text-sm sm:text-base font-extrabold profile-modal-gold flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <AnimatedCounter value={player.stats.trophies} />
                </div>
              </div>
              <div className="profile-modal-box p-2.5 rounded-xl text-center">
                <div className="text-[10px] uppercase profile-modal-muted font-bold">
                  {lang === 'vi' ? 'G+A / 90 phút' : 'G+A / 90'}
                </div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  <AnimatedCounter value={player.stats.gaPer90} decimals={2} />
                </div>
              </div>
              <div className="profile-modal-box p-2.5 rounded-xl text-center">
                <div className="text-[10px] uppercase profile-modal-muted font-bold">
                  {lang === 'vi' ? 'Tốc độ tối đa' : 'Top Speed'}
                </div>
                <div className="text-sm sm:text-base font-extrabold text-sky-600 dark:text-sky-400 flex items-center justify-center gap-0.5">
                  <Gauge className="w-3 h-3" />
                  <AnimatedCounter value={player.stats.topSpeedKmh} decimals={1} />
                </div>
              </div>
            </div>

            {/* SECTION C: BIỂU ĐỒ RADAR 6 TRỤC (SVG) & ĐIỂM NHẤN CHUYÊN MÔN */}
            <div className="profile-modal-box grid grid-cols-1 sm:grid-cols-12 gap-4 rounded-2xl p-4 items-center">
              {/* 6-Axis SVG Radar */}
              <div className="sm:col-span-5 flex flex-col items-center profile-modal-title">
                <div className="text-[11px] font-extrabold uppercase tracking-wider profile-modal-gold mb-1 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Biểu Đồ Radar 6 Trục' : '6-Axis Radar Chart'}</span>
                </div>
                <svg viewBox="0 0 220 220" className="w-full max-w-[205px] h-auto overflow-visible">
                  {[0.25, 0.5, 0.75, 1].map((scale) => {
                    const pts = MODAL_RADAR_AXES.map((_, idx) => {
                      const angle = (Math.PI * 2 * idx) / MODAL_RADAR_AXES.length - Math.PI / 2;
                      const r = scale * 80;
                      return `${(110 + r * Math.cos(angle)).toFixed(1)},${(
                        110 +
                        r * Math.sin(angle)
                      ).toFixed(1)}`;
                    }).join(' ');
                    return (
                      <polygon
                        key={scale}
                        points={pts}
                        fill="none"
                        stroke="rgba(212,175,55,0.4)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {MODAL_RADAR_AXES.map((axis, idx) => {
                    const angle = (Math.PI * 2 * idx) / MODAL_RADAR_AXES.length - Math.PI / 2;
                    const x2 = 110 + 80 * Math.cos(angle);
                    const y2 = 110 + 80 * Math.sin(angle);
                    const lx = 110 + 99 * Math.cos(angle);
                    const ly = 110 + 95 * Math.sin(angle);
                    return (
                      <g key={axis.key}>
                        <line
                          x1="110"
                          y1="110"
                          x2={x2}
                          y2={y2}
                          stroke="rgba(212,175,55,0.3)"
                          strokeWidth="1"
                        />
                        <text
                          x={lx}
                          y={ly}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="currentColor"
                          fontSize="7.5"
                          fontWeight="700"
                        >
                          {axis[lang]}
                        </text>
                      </g>
                    );
                  })}

                  <polygon
                    points={getRadarPolygonPoints()}
                    fill="#D4AF37"
                    fillOpacity="0.3"
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                    style={{
                      transformOrigin: '110px 110px',
                      transform: isRevealed ? 'scale(1)' : 'scale(0.15)',
                      opacity: isRevealed ? 1 : 0,
                      transition:
                        'transform 450ms var(--ease-out-expo), opacity 320ms var(--ease-out-expo)',
                    }}
                  />
                </svg>
              </div>

              {/* 6-Axis Progress Bars & Quantitative Highlights */}
              <div className="sm:col-span-7 space-y-3">
                <div className="space-y-1.5">
                  {MODAL_RADAR_AXES.map((axis, idx) => {
                    const val = player.radarPercentiles[axis.key] ?? 50;
                    return (
                      <div key={axis.key} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold profile-modal-body">{axis[lang]}</span>
                          <span className="font-extrabold profile-modal-gold">{val}/99</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-300/40 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D061] progress-bar-fill"
                            style={{
                              width: isRevealed ? `${val}%` : '0%',
                              transitionDelay: `${idx * 45}ms`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quantitative Highlights */}
                <div className="pt-2 border-t border-[#D4AF37]/25 space-y-1">
                  <div className="text-[11px] font-extrabold uppercase profile-modal-gold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'vi'
                        ? 'Điểm Nhấn Thống Kê & Di Sản:'
                        : 'Quantitative Performance Highlights:'}
                    </span>
                  </div>
                  <ul className="space-y-1 text-[11px] profile-modal-body font-medium">
                    {player.highlights[lang].map((hl) => (
                      <li key={hl} className="flex items-start gap-1.5">
                        <span className="profile-modal-gold font-bold">•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
