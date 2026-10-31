import React, { useMemo, useState } from 'react';
import { Crosshair, Flame, Layers, Radar, Sparkles, Target } from 'lucide-react';
import { Language, PlayerProfile } from '../types/database';
import { PlayerAvatar } from './PlayerAvatar';

interface OptaTacticalPitchLabProps {
  players: PlayerProfile[];
  lang: Language;
  onSelectPlayer: (player: PlayerProfile) => void;
}

type PitchOverlayMode = 'formation_shotmap' | 'xg_zones' | 'pass_network';
type BmvFilterId = 'all' | 'kylian-mbappe' | 'vinicius-junior' | 'jude-bellingham' | 'yan-diomande';

interface ShotEventPoint {
  id: string;
  playerId: BmvFilterId;
  playerLabel: string;
  shirt: number;
  x: number; // 0..105 (Opta pitch coordinates, attacking right 52.5..105)
  y: number; // 0..68
  xg: number;
  isGoal: boolean;
  matchLabel: string;
  color: string;
}

const BMV_SHOT_EVENTS: ShotEventPoint[] = [
  { id: 's1', playerId: 'kylian-mbappe', playerLabel: 'K. Mbappé', shirt: 10, x: 93.5, y: 31.0, xg: 0.64, isGoal: true, matchLabel: "El Clásico 41' (1-1)", color: '#D4AF37' },
  { id: 's2', playerId: 'kylian-mbappe', playerLabel: 'K. Mbappé', shirt: 10, x: 90.2, y: 26.4, xg: 0.48, isGoal: true, matchLabel: "El Clásico 87' (1-2 • 100th G)", color: '#D4AF37' },
  { id: 's3', playerId: 'kylian-mbappe', playerLabel: 'K. Mbappé', shirt: 10, x: 96.0, y: 34.5, xg: 0.76, isGoal: true, matchLabel: 'UEFA Super Cup vs Atalanta', color: '#D4AF37' },
  { id: 's4', playerId: 'kylian-mbappe', playerLabel: 'K. Mbappé', shirt: 10, x: 85.4, y: 22.8, xg: 0.21, isGoal: false, matchLabel: 'UCL QF Transition Shot', color: '#D4AF37' },
  { id: 's5', playerId: 'kylian-mbappe', playerLabel: 'K. Mbappé', shirt: 10, x: 91.8, y: 38.2, xg: 0.52, isGoal: true, matchLabel: 'Intercontinental Final', color: '#D4AF37' },
  { id: 's6', playerId: 'vinicius-junior', playerLabel: 'Vinícius Jr', shirt: 7, x: 92.4, y: 21.5, xg: 0.44, isGoal: true, matchLabel: 'UCL Final Wembley 2024 (2-0)', color: '#38BDF8' },
  { id: 's7', playerId: 'vinicius-junior', playerLabel: 'Vinícius Jr', shirt: 7, x: 88.6, y: 18.2, xg: 0.29, isGoal: true, matchLabel: 'Left Half-Space Cutback', color: '#38BDF8' },
  { id: 's8', playerId: 'vinicius-junior', playerLabel: 'Vinícius Jr', shirt: 7, x: 94.8, y: 29.0, xg: 0.58, isGoal: true, matchLabel: 'UCL Hat-Trick vs Dortmund', color: '#38BDF8' },
  { id: 's9', playerId: 'vinicius-junior', playerLabel: 'Vinícius Jr', shirt: 7, x: 84.0, y: 16.5, xg: 0.16, isGoal: false, matchLabel: 'Curled Far-Post Effort', color: '#38BDF8' },
  { id: 's10', playerId: 'jude-bellingham', playerLabel: 'J. Bellingham', shirt: 5, x: 93.0, y: 35.8, xg: 0.55, isGoal: true, matchLabel: "90+1' El Clásico Winner", color: '#10B981' },
  { id: 's11', playerId: 'jude-bellingham', playerLabel: 'J. Bellingham', shirt: 5, x: 82.5, y: 33.4, xg: 0.14, isGoal: true, matchLabel: 'Montjuïc 28m Screamer', color: '#10B981' },
  { id: 's12', playerId: 'jude-bellingham', playerLabel: 'J. Bellingham', shirt: 5, x: 90.0, y: 39.5, xg: 0.37, isGoal: true, matchLabel: 'Late Box Arrival Zone 14', color: '#10B981' },
  { id: 's13', playerId: 'yan-diomande', playerLabel: 'Yan Diomande', shirt: 25, x: 89.5, y: 48.2, xg: 0.33, isGoal: true, matchLabel: 'Right Wing Inverted Strike', color: '#A855F7' },
  { id: 's14', playerId: 'yan-diomande', playerLabel: 'Yan Diomande', shirt: 25, x: 93.8, y: 43.0, xg: 0.46, isGoal: true, matchLabel: 'Back-Post Diagonal Finish', color: '#A855F7' },
];

interface PitchStarterNode {
  id: string;
  shirt: number;
  label: string;
  role: string;
  xPct: number;
  yPct: number;
  accent: string;
}

const STARTING_XI_2026: PitchStarterNode[] = [
  { id: 'thibaut-courtois', shirt: 1, label: 'Courtois', role: 'GK', xPct: 7, yPct: 50, accent: '#94A3B8' },
  { id: 'trent-alexander-arnold', shirt: 12, label: 'Trent A-A', role: 'RB/IWB', xPct: 26, yPct: 82, accent: '#38BDF8' },
  { id: 'antonio-rudiger', shirt: 22, label: 'Rüdiger', role: 'RCB', xPct: 20, yPct: 62, accent: '#94A3B8' },
  { id: 'dean-huijsen', shirt: 4, label: 'Huijsen', role: 'LCB', xPct: 20, yPct: 38, accent: '#94A3B8' },
  { id: 'alvaro-carreras', shirt: 18, label: 'Carreras', role: 'LB', xPct: 26, yPct: 18, accent: '#38BDF8' },
  { id: 'aurelien-tchouameni', shirt: 14, label: 'Tchouaméni', role: 'DM (#6)', xPct: 41, yPct: 50, accent: '#94A3B8' },
  { id: 'federico-valverde', shirt: 8, label: 'Valverde (C)', role: 'RCM (#8)', xPct: 53, yPct: 70, accent: '#D4AF37' },
  { id: 'eduardo-camavinga', shirt: 6, label: 'Camavinga', role: 'LCM', xPct: 51, yPct: 30, accent: '#38BDF8' },
  { id: 'jude-bellingham', shirt: 5, label: 'Bellingham', role: 'AM (Z14)', xPct: 67, yPct: 50, accent: '#10B981' },
  { id: 'vinicius-junior', shirt: 7, label: 'Vinícius Jr', role: 'LW/IF', xPct: 82, yPct: 22, accent: '#38BDF8' },
  { id: 'kylian-mbappe', shirt: 10, label: 'Mbappé', role: 'ST (#10)', xPct: 86, yPct: 54, accent: '#D4AF37' },
];

const RADAR_METRICS: Array<{
  key: keyof PlayerProfile['radarPercentiles'];
  vi: string;
  en: string;
}> = [
  { key: 'scoring', vi: 'Dứt điểm (xG)', en: 'Scoring (xG)' },
  { key: 'creativity', vi: 'Kiến tạo (xA)', en: 'Creativity (xA)' },
  { key: 'progression', vi: 'Tịnh tiến bóng', en: 'Progression' },
  { key: 'paceAndPhysical', vi: 'Tốc độ bứt tốc', en: 'Sprint Velocity' },
  { key: 'defensiveWork', vi: 'Pressing & Thu hồi', en: 'Pressing Work' },
  { key: 'bigGameImpact', vi: 'Bản lĩnh C1', en: 'UCL DNA' },
];

export const OptaTacticalPitchLab: React.FC<OptaTacticalPitchLabProps> = ({
  players,
  lang,
  onSelectPlayer,
}) => {
  const [overlayMode, setOverlayMode] = useState<PitchOverlayMode>('formation_shotmap');
  const [bmvFilter, setBmvFilter] = useState<BmvFilterId>('all');
  const [perspective3D, setPerspective3D] = useState<boolean>(true);
  const [hoveredShot, setHoveredShot] = useState<ShotEventPoint | null>(null);

  const radarPlayers = useMemo(() => {
    const ids = ['kylian-mbappe', 'vinicius-junior', 'jude-bellingham'];
    return ids
      .map((id) => players.find((p) => p.id === id))
      .filter((p): p is PlayerProfile => Boolean(p));
  }, [players]);

  const filteredShots = useMemo(() => {
    if (bmvFilter === 'all') return BMV_SHOT_EVENTS;
    return BMV_SHOT_EVENTS.filter((s) => s.playerId === bmvFilter);
  }, [bmvFilter]);

  // Radar SVG geometry
  const radarSize = 260;
  const cx = radarSize / 2;
  const cy = radarSize / 2;
  const maxR = 92;

  const buildRadarPolygon = (profile: PlayerProfile) => {
    return RADAR_METRICS.map((axis, i) => {
      const angle = (Math.PI * 2 * i) / RADAR_METRICS.length - Math.PI / 2;
      const val = (profile.radarPercentiles[axis.key] || 75) / 100;
      const r = val * maxR;
      return `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
    }).join(' ');
  };

  const radarColors = ['#D4AF37', '#38BDF8', '#10B981'];

  return (
    <div className="glass-royal rounded-2xl p-5 sm:p-6 lg:p-7 border border-[#D4AF37]/25 relative overflow-hidden">
      {/* Top Broadcast Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#D4AF37]/20">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#F5D061] mb-1">
            <Crosshair className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>OPTA ANALYST 2D/3D TACTICAL PITCH • BMV SHOT MAP &amp; XG ZONE LAB</span>
          </div>
          <h2 className="font-royal text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-wide">
            {lang === 'vi'
              ? 'Sa Bàn Chiến Thuật 2026/27, Bản Đồ Dứt Điểm xG & Radar 6 Trục'
              : '2026/27 Interactive Tactical Pitch, BMV xG Shot Map & 6-Axis Radar'}
          </h2>
        </div>

        {/* Mode & 3D Tilt Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center bg-[#050914]/90 p-1 rounded-xl border border-[#D4AF37]/25">
            {(
              [
                { id: 'formation_shotmap', labelVi: 'Đội Hình + Shot Map', labelEn: 'XI + Shot Map', icon: Target },
                { id: 'xg_zones', labelVi: 'Vùng Nhiệt xG (Zone 14)', labelEn: 'xG Heat Zones', icon: Flame },
                { id: 'pass_network', labelVi: 'Mạng Lưới Tịnh Tiến', labelEn: 'Pass Vectors', icon: Layers },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = overlayMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setOverlayMode(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-all ${
                    active
                      ? 'bg-[#D4AF37] text-[#050914] font-bold shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? tab.labelVi : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPerspective3D((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl border font-mono text-[11px] transition-all ${
              perspective3D
                ? 'bg-[#1D4ED8]/30 border-[#D4AF37]/50 text-[#F5D061]'
                : 'bg-[#050914]/80 border-white/15 text-slate-300'
            }`}
          >
            {perspective3D ? '3D Bernabéu Tilt: ON' : '2D Top-Down View'}
          </button>
        </div>
      </div>

      {/* Main 12-Col Broadcast Grid: 8-Col Opta Pitch + 4-Col 6-Axis Radar & xG Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-stretch">
        {/* LEFT 8 COLS: 2D/3D OPTA FOOTBALL PITCH */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-3">
          {/* BMV Player Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: lang === 'vi' ? 'Tất cả Tam Tấu BMV + #25' : 'All BMV + #25', badge: '2.35 G+A/90' },
                  { id: 'kylian-mbappe', label: '#10 Mbappé', badge: '100G • ΔxG +12.28' },
                  { id: 'vinicius-junior', label: '#7 Vinícius Jr', badge: '118G • 98A' },
                  { id: 'jude-bellingham', label: '#5 Bellingham', badge: '49G • 36A' },
                  { id: 'yan-diomande', label: '#25 Diomande', badge: '35.9 km/h' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setBmvFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-all flex items-center gap-1.5 ${
                    bmvFilter === f.id
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F8FAFC] font-semibold'
                      : 'bg-[#050914]/70 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="text-[10px] text-[#F5D061]">{f.badge}</span>
                </button>
              ))}
            </div>

            <span className="font-mono text-[11px] text-slate-400">
              {lang === 'vi' ? 'Click cầu thủ trên sân để mở Hồ sơ' : 'Click any pitch node for profile'}
            </span>
          </div>

          {/* Interactive Opta Pitch Container */}
          <div
            className="relative w-full aspect-[105/68] rounded-2xl overflow-hidden border border-[#D4AF37]/35 shadow-[0_25px_60px_-15px_rgba(2,6,23,0.95)] select-none transition-transform duration-500"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, #0b2922 0%, #061816 58%, #040d18 100%)',
              transform: perspective3D
                ? 'perspective(1200px) rotateX(10deg) scale(0.99)'
                : 'none',
              transformOrigin: 'center center',
            }}
          >
            {/* Pitch Stripes & Crisp Opta Markings SVG */}
            <svg
              viewBox="0 0 105 68"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <radialGradient id="xgHeatMbappe" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.52" />
                  <stop offset="55%" stopColor="#F97316" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="xgHeatVini" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.48" />
                  <stop offset="60%" stopColor="#1D4ED8" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="xgHeatJude" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.46" />
                  <stop offset="60%" stopColor="#10B981" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Subtle Turf Stripes */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((stripe) => (
                <rect
                  key={stripe}
                  x={stripe * 10.5}
                  y={0}
                  width={10.5}
                  height={68}
                  fill={stripe % 2 === 0 ? 'rgba(255,255,255,0.018)' : 'transparent'}
                />
              ))}

              {/* Outer Boundary & Halfway Line */}
              <rect
                x="2"
                y="2"
                width="101"
                height="64"
                fill="none"
                stroke="rgba(212,175,55,0.45)"
                strokeWidth="0.45"
              />
              <line
                x1="52.5"
                y1="2"
                x2="52.5"
                y2="66"
                stroke="rgba(212,175,55,0.4)"
                strokeWidth="0.4"
              />
              <circle
                cx="52.5"
                cy="34"
                r="9.15"
                fill="none"
                stroke="rgba(212,175,55,0.4)"
                strokeWidth="0.4"
              />
              <circle cx="52.5" cy="34" r="0.6" fill="#D4AF37" />

              {/* Left Penalty Area */}
              <rect
                x="2"
                y="13.84"
                width="16.5"
                height="40.32"
                fill="none"
                stroke="rgba(248,250,252,0.32)"
                strokeWidth="0.38"
              />
              <rect
                x="2"
                y="24.84"
                width="5.5"
                height="18.32"
                fill="none"
                stroke="rgba(248,250,252,0.32)"
                strokeWidth="0.38"
              />

              {/* Right Penalty Area (Attacking Goal) */}
              <rect
                x="86.5"
                y="13.84"
                width="16.5"
                height="40.32"
                fill="rgba(212,175,55,0.04)"
                stroke="rgba(212,175,55,0.55)"
                strokeWidth="0.45"
              />
              <rect
                x="97.5"
                y="24.84"
                width="5.5"
                height="18.32"
                fill="none"
                stroke="rgba(212,175,55,0.55)"
                strokeWidth="0.45"
              />

              {/* Opta Tactical Half-Space & Zone 14 Grid Lines */}
              <line
                x1="70"
                y1="13.84"
                x2="86.5"
                y2="13.84"
                stroke="rgba(212,175,55,0.22)"
                strokeWidth="0.3"
                strokeDasharray="1.2 1.2"
              />
              <line
                x1="70"
                y1="54.16"
                x2="86.5"
                y2="54.16"
                stroke="rgba(212,175,55,0.22)"
                strokeWidth="0.3"
                strokeDasharray="1.2 1.2"
              />
              <rect
                x="70"
                y="24.84"
                width="16.5"
                height="18.32"
                fill="rgba(16,185,129,0.08)"
                stroke="rgba(16,185,129,0.35)"
                strokeWidth="0.35"
                strokeDasharray="1 1"
              />
              <text
                x="78.25"
                y="33.5"
                textAnchor="middle"
                fill="rgba(16,185,129,0.75)"
                fontSize="2.1"
                fontFamily="JetBrains Mono, monospace"
              >
                ZONE 14 (#5 JUDE)
              </text>

              {/* XG HEAT ZONES OVERLAY */}
              {(overlayMode === 'xg_zones' || overlayMode === 'formation_shotmap') && (
                <g>
                  <ellipse cx="91" cy="31" rx="10" ry="8" fill="url(#xgHeatMbappe)" />
                  <ellipse cx="88" cy="19" rx="9" ry="6.5" fill="url(#xgHeatVini)" />
                  <ellipse cx="79" cy="35" rx="8.5" ry="6.5" fill="url(#xgHeatJude)" />
                </g>
              )}

              {/* PASSING NETWORK & PROGRESSIVE VECTORS */}
              {(overlayMode === 'pass_network' || overlayMode === 'formation_shotmap') && (
                <g>
                  {/* Trent #12 long diagonal to Vini #7 & Mbappé #10 */}
                  <path
                    d="M 27.3 55.7 Q 56 38 86.1 15.0"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="0.45"
                    className="animate-pitch-flow"
                    opacity="0.7"
                  />
                  {/* Valverde #8 to Mbappé #10 */}
                  <path
                    d="M 55.6 47.6 Q 72 44 90.3 36.7"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="0.55"
                    className="animate-pitch-flow"
                    opacity="0.85"
                  />
                  {/* Bellingham #5 Zone 14 through-ball to Mbappé #10 & Vini #7 */}
                  <line
                    x1="70.3"
                    y1="34.0"
                    x2="90.3"
                    y2="36.7"
                    stroke="#10B981"
                    strokeWidth="0.55"
                    className="animate-pitch-flow"
                  />
                  <line
                    x1="70.3"
                    y1="34.0"
                    x2="86.1"
                    y2="15.0"
                    stroke="#10B981"
                    strokeWidth="0.45"
                    className="animate-pitch-flow"
                  />
                </g>
              )}

              {/* SHOT MAP NODES (SIZED BY XG) */}
              {filteredShots.map((s) => {
                const radius = 0.85 + s.xg * 1.65;
                return (
                  <g
                    key={s.id}
                    onMouseEnter={() => setHoveredShot(s)}
                    onMouseLeave={() => setHoveredShot(null)}
                    className="cursor-pointer"
                  >
                    {/* Shot Trajectory Line to Goal */}
                    {s.isGoal && (
                      <line
                        x1={s.x}
                        y1={s.y}
                        x2={103}
                        y2={34}
                        stroke={s.color}
                        strokeWidth="0.28"
                        strokeDasharray="0.8 0.8"
                        opacity="0.65"
                      />
                    )}
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r={radius}
                      fill={s.isGoal ? s.color : 'rgba(5,9,20,0.85)'}
                      fillOpacity={s.isGoal ? 0.85 : 0.7}
                      stroke={s.color}
                      strokeWidth="0.4"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Starting XI Player Nodes */}
            {STARTING_XI_2026.map((node) => {
              const profile = players.find((p) => p.id === node.id);
              return (
                <button
                  key={node.id}
                  onClick={() => profile && onSelectPlayer(profile)}
                  style={{ left: `${node.xPct}%`, top: `${node.yPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 focus:outline-none"
                  title={`${node.label} (#${node.shirt} • ${node.role})`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-[11px] font-bold text-[#F8FAFC] shadow-lg transition-transform duration-200 group-hover:scale-125"
                      style={{
                        backgroundColor: '#050914',
                        border: `2px solid ${node.accent}`,
                        boxShadow: `0 0 14px ${node.accent}55`,
                      }}
                    >
                      {node.shirt}
                    </div>
                    <span className="mt-1 px-1.5 py-0.5 rounded bg-[#050914]/90 border border-[#D4AF37]/30 font-mono text-[9.5px] sm:text-[10px] font-semibold text-[#F8FAFC] whitespace-nowrap group-hover:border-[#D4AF37] group-hover:text-[#F5D061]">
                      {node.label}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Live Shot Tooltip Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-[#050914]/90 border border-[#D4AF37]/35 font-mono text-[11px] text-slate-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F5D061]" />
                {hoveredShot ? (
                  <span>
                    <strong className="text-[#F5D061]">
                      #{hoveredShot.shirt} {hoveredShot.playerLabel}
                    </strong>{' '}
                    • {hoveredShot.matchLabel} •{' '}
                    <span className="text-emerald-400">xG {hoveredShot.xg.toFixed(2)}</span> (
                    {hoveredShot.isGoal ? 'GOAL' : 'Saved'})
                  </span>
                ) : (
                  <span>
                    {lang === 'vi'
                      ? 'Sơ đồ 4-3-1-2 / 4-3-3 Hybrid • Di chuột vào điểm dứt điểm để xem xG'
                      : '4-3-1-2 / 4-3-3 Hybrid • Hover any shot circle to inspect xG'}
                  </span>
                )}
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-[#050914]/90 border border-[#D4AF37]/35 font-mono text-[11px] text-[#F5D061]">
                Attacking Direction →
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: LIVE 6-AXIS OPTA RADAR & BMV TELEMETRY */}
        <div className="lg:col-span-4 bg-[#050914]/80 border border-[#D4AF37]/25 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
              <div className="flex items-center gap-2">
                <Radar className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-royal text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">
                  {lang === 'vi' ? 'Radar 6 Trục Tam Tấu BMV' : 'BMV 6-Axis Opta Radar'}
                </h3>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D061]">
                P99 Percentile
              </span>
            </div>

            {/* 6-Axis SVG Radar */}
            <div className="my-3 flex justify-center">
              <svg viewBox={`0 0 ${radarSize} ${radarSize}`} className="w-full max-w-[250px] h-auto overflow-visible">
                {/* Concentric Hexagons */}
                {[0.25, 0.5, 0.75, 1].map((lvl) => {
                  const pts = RADAR_METRICS.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / RADAR_METRICS.length - Math.PI / 2;
                    const r = lvl * maxR;
                    return `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={lvl}
                      points={pts}
                      fill="none"
                      stroke="rgba(212,175,55,0.18)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Axis Spokes & Labels */}
                {RADAR_METRICS.map((axis, i) => {
                  const angle = (Math.PI * 2 * i) / RADAR_METRICS.length - Math.PI / 2;
                  const x2 = cx + Math.cos(angle) * maxR;
                  const y2 = cy + Math.sin(angle) * maxR;
                  const lx = cx + Math.cos(angle) * (maxR + 22);
                  const ly = cy + Math.sin(angle) * (maxR + 16);
                  return (
                    <g key={axis.key}>
                      <line
                        x1={cx}
                        y1={cy}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(212,175,55,0.22)"
                        strokeWidth="1"
                      />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#CBD5E1"
                        fontSize="8.5"
                        className="font-mono"
                      >
                        {lang === 'vi' ? axis.vi : axis.en}
                      </text>
                    </g>
                  );
                })}

                {/* Player Polygons */}
                {radarPlayers.map((p, idx) => (
                  <polygon
                    key={p.id}
                    points={buildRadarPolygon(p)}
                    fill={radarColors[idx]}
                    fillOpacity={0.16}
                    stroke={radarColors[idx]}
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* BMV Player Cards inside Radar Panel */}
          <div className="space-y-2 pt-2 border-t border-[#D4AF37]/20">
            {radarPlayers.map((star, idx) => (
              <div
                key={star.id}
                onClick={() => onSelectPlayer(star)}
                className="p-2.5 rounded-xl bg-[#0B1224]/90 hover:bg-[#101A33] border border-[#D4AF37]/25 transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: radarColors[idx] }}
                  />
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#050914] border border-[#D4AF37]/30 shrink-0">
                    <PlayerAvatar
                      src={star.imageUrl}
                      name={star.name}
                      shirtNumber={star.shirtNumber}
                      position={star.specificPositions.join('/')}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#F8FAFC] truncate group-hover:text-[#F5D061]">
                      #{star.shirtNumber} {star.name}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      xG: {star.stats.xG?.toFixed(1) ?? '—'} • ΔxG: +{star.stats.deltaXG?.toFixed(2) ?? '—'}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono shrink-0">
                  <div className="text-xs font-bold text-[#F5D061]">
                    {star.stats.goals}G • {star.stats.assists}A
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    {star.stats.gaPer90.toFixed(2)} G+A/90
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
