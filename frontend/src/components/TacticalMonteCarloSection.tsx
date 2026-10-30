import React, { useRef, useState } from 'react';
import {
  Cpu,
  Dices,
  Move,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  Language,
  MonteCarloSimulationData,
  PlayerProfile,
  PrecomputedMatchup,
} from '../types/database';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerWalkoutModal } from './PlayerWalkoutModal';

interface TacticalMonteCarloSectionProps {
  players: PlayerProfile[];
  monteCarlo: MonteCarloSimulationData;
  lang: Language;
}

interface CustomXISlot {
  slotId: string;
  roleLabel: string;
  playerId: string;
  x: number;
  y: number;
}

const DEFAULT_PRESETS: Record<string, CustomXISlot[]> = {
  all_time_dream: [
    { slotId: 'GK', roleLabel: 'GK', playerId: 'iker-casillas', x: 50, y: 89 },
    { slotId: 'RB', roleLabel: 'RB', playerId: 'trent-alexander-arnold', x: 82, y: 71 },
    { slotId: 'RCB', roleLabel: 'CB', playerId: 'sergio-ramos', x: 61, y: 74 },
    { slotId: 'LCB', roleLabel: 'CB', playerId: 'fernando-hierro', x: 39, y: 74 },
    { slotId: 'LB', roleLabel: 'LB', playerId: 'roberto-carlos', x: 18, y: 71 },
    { slotId: 'RCM', roleLabel: 'CM', playerId: 'luka-modric', x: 68, y: 51 },
    { slotId: 'CDM', roleLabel: 'DLP', playerId: 'toni-kroos', x: 32, y: 51 },
    { slotId: 'CAM', roleLabel: 'AM', playerId: 'zinedine-zidane', x: 50, y: 38 },
    { slotId: 'RW', roleLabel: 'RW', playerId: 'alfredo-di-stefano', x: 80, y: 22 },
    { slotId: 'ST', roleLabel: 'ST', playerId: 'cristiano-ronaldo', x: 50, y: 16 },
    { slotId: 'LW', roleLabel: 'LW', playerId: 'kylian-mbappe', x: 20, y: 22 },
  ],
  squad_2026_supersonic: [
    { slotId: 'GK', roleLabel: 'GK', playerId: 'thibaut-courtois', x: 50, y: 89 },
    { slotId: 'RB', roleLabel: 'RB', playerId: 'trent-alexander-arnold', x: 82, y: 71 },
    { slotId: 'RCB', roleLabel: 'CB', playerId: 'antonio-rudiger', x: 61, y: 74 },
    { slotId: 'LCB', roleLabel: 'CB', playerId: 'dean-huijsen', x: 39, y: 74 },
    { slotId: 'LB', roleLabel: 'LB', playerId: 'alvaro-carreras', x: 18, y: 71 },
    { slotId: 'RCM', roleLabel: 'CM', playerId: 'federico-valverde', x: 66, y: 53 },
    { slotId: 'CDM', roleLabel: 'CDM', playerId: 'aurelien-tchouameni', x: 34, y: 53 },
    { slotId: 'CAM', roleLabel: 'AM', playerId: 'jude-bellingham', x: 50, y: 36 },
    { slotId: 'RW', roleLabel: 'RW', playerId: 'yan-diomande', x: 81, y: 22 },
    { slotId: 'ST', roleLabel: 'ST', playerId: 'kylian-mbappe', x: 50, y: 15 },
    { slotId: 'LW', roleLabel: 'LW', playerId: 'vinicius-junior', x: 19, y: 22 },
  ],
};

const TACTICAL_LINKS: Array<[string, string]> = [
  ['GK', 'RCB'],
  ['GK', 'LCB'],
  ['RCB', 'RB'],
  ['LCB', 'LB'],
  ['RCB', 'RCM'],
  ['LCB', 'CDM'],
  ['RCM', 'CAM'],
  ['CDM', 'CAM'],
  ['RB', 'RW'],
  ['LB', 'LW'],
  ['CAM', 'RW'],
  ['CAM', 'LW'],
  ['CAM', 'ST'],
  ['RW', 'ST'],
  ['LW', 'ST'],
];

function samplePoisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1.0;
  do {
    k += 1;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export const TacticalMonteCarloSection: React.FC<TacticalMonteCarloSectionProps> = ({
  players,
  monteCarlo,
  lang,
}) => {
  const [lineup, setLineup] = useState<CustomXISlot[]>(DEFAULT_PRESETS.squad_2026_supersonic);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('RW');
  const [draggingSlotId, setDraggingSlotId] = useState<string | null>(null);
  const [walkoutPlayer, setWalkoutPlayer] = useState<PlayerProfile | null>(null);
  const pitchRef = useRef<HTMLDivElement | null>(null);

  // Monte Carlo Simulator States
  const [teamAId, setTeamAId] = useState<string>('rm_2026');
  const [teamBId, setTeamBId] = useState<string>('rm_2017');
  const [liveSimResult, setLiveSimResult] = useState<PrecomputedMatchup | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const playerMap = new Map(players.map((p) => [p.id, p]));
  const slotMap = new Map(lineup.map((s) => [s.slotId, s]));
  const selectedSlotPlayer = playerMap.get(
    lineup.find((s) => s.slotId === selectedSlotId)?.playerId ?? 'yan-diomande'
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingSlotId || !pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const relX = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 8), 92);
    const relY = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 10), 92);
    setLineup((prev) =>
      prev.map((slot) =>
        slot.slotId === draggingSlotId
          ? { ...slot, x: Math.round(relX), y: Math.round(relY) }
          : slot
      )
    );
  };

  const replaceSlotPlayer = (newPlayerId: string) => {
    setLineup((prev) =>
      prev.map((slot) =>
        slot.slotId === selectedSlotId ? { ...slot, playerId: newPlayerId } : slot
      )
    );
  };

  // Run Live 10,000-Iteration Bivariate Poisson Monte Carlo in Browser
  const runLive10000MonteCarlo = () => {
    const teamA = monteCarlo.eras.find((e) => e.id === teamAId) ?? monteCarlo.eras[3];
    const teamB = monteCarlo.eras.find((e) => e.id === teamBId) ?? monteCarlo.eras[2];
    if (!teamA || !teamB) return;

    setIsSimulating(true);
    setTimeout(() => {
      const n = 10000;
      const l3 = 0.5 * (teamA.covarianceL3 + teamB.covarianceL3);
      const l1 = Math.max(
        0.4,
        ((teamA.lambdaAttack * teamB.lambdaDefense) / 1.1) * (teamA.remontadaFactor / 1.2) - l3
      );
      const l2 = Math.max(
        0.4,
        ((teamB.lambdaAttack * teamA.lambdaDefense) / 1.1) * (teamB.remontadaFactor / 1.2) - l3
      );

      let winsA = 0;
      let draws = 0;
      let winsB = 0;
      let sumA = 0;
      let sumB = 0;
      const scoreCounts: Record<string, number> = {};

      for (let i = 0; i < n; i++) {
        const y1 = samplePoisson(l1);
        const y2 = samplePoisson(l2);
        const y3 = samplePoisson(l3);
        const ga = y1 + y3;
        const gb = y2 + y3;
        sumA += ga;
        sumB += gb;
        if (ga > gb) winsA++;
        else if (ga === gb) draws++;
        else winsB++;
        const key = `${ga}–${gb}`;
        scoreCounts[key] = (scoreCounts[key] ?? 0) + 1;
      }

      const topScorelines = Object.entries(scoreCounts)
        .map(([score, count]) => ({
          score,
          probabilityPct: Number(((count / n) * 100).toFixed(2)),
        }))
        .sort((a, b) => b.probabilityPct - a.probabilityPct)
        .slice(0, 6);

      setLiveSimResult({
        teamA: teamA.id,
        teamB: teamB.id,
        simulations: n,
        lambdaA: Number((l1 + l3).toFixed(2)),
        lambdaB: Number((l2 + l3).toFixed(2)),
        covarianceLambda3: Number(l3.toFixed(2)),
        winProbA: Number(((winsA / n) * 100).toFixed(1)),
        drawProb: Number(((draws / n) * 100).toFixed(1)),
        winProbB: Number(((winsB / n) * 100).toFixed(1)),
        avgGoalsA: Number((sumA / n).toFixed(2)),
        avgGoalsB: Number((sumB / n).toFixed(2)),
        topScorelines,
      });
      setIsSimulating(false);
    }, 120);
  };

  const activeMatchupKey = `${teamAId}__vs__${teamBId}`;
  const currentMatchup: PrecomputedMatchup | undefined =
    liveSimResult && liveSimResult.teamA === teamAId && liveSimResult.teamB === teamBId
      ? liveSimResult
      : monteCarlo.precomputedMatchups[activeMatchupKey];

  const eraA = monteCarlo.eras.find((e) => e.id === teamAId) ?? monteCarlo.eras[3];
  const eraB = monteCarlo.eras.find((e) => e.id === teamBId) ?? monteCarlo.eras[2];

  return (
    <section
      id="simulator"
      className="heavy-section-deferred py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-semibold uppercase tracking-widest mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi'
                ? 'Phân Hệ 5 • Sa Bàn Phát Sáng Động & Mô Hình Bivariate Poisson'
                : 'Module 5 • Interactive Glow Pitch & Monte Carlo Simulator'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'vi'
              ? 'XẾP ĐỘI HÌNH VĨ ĐẠI NHẤT & GIẢ LẬP XUYÊN KHÔNG (10.000 TRẬN)'
              : 'ALL-TIME XI TACTICAL BUILDER & 10,000-MATCH MONTE CARLO SIMULATOR'}
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-xl">
          {lang === 'vi'
            ? 'Kéo thả cầu thủ trên mặt sân 2D phát sáng động (Interactive Pitch Glow) và chạy thuật toán Monte Carlo 10.000 vòng lặp so tài giữa 4 thế hệ hoàng kim.'
            : 'Drag and drop players on the glowing 2D pitch with dynamic pass links and run 10,000 Bivariate Poisson Monte Carlo iterations.'}
        </p>
      </div>

      {/* PART A: INTERACTIVE DRAG & DROP 2D ALL-TIME XI BUILDER WITH PITCH GLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
        {/* Left Pitch Canvas */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setLineup(DEFAULT_PRESETS.squad_2026_supersonic)}
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#060913] text-xs font-extrabold"
              >
                {lang === 'vi'
                  ? 'Đội Hình 2026/27 (HLV José Mourinho)'
                  : '2026/27 XI (Coach José Mourinho)'}
              </button>
              <button
                onClick={() => setLineup(DEFAULT_PRESETS.all_time_dream)}
                className="px-3 py-1.5 rounded-lg bg-[#16203D] border border-[#D4AF37]/40 text-[#F5D061] text-xs font-bold hover:bg-[#D4AF37]/20"
              >
                {lang === 'vi'
                  ? 'Đội Hình Huyền Thoại Mọi Thời Đại'
                  : 'All-Time Legends XI'}
              </button>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
              <Move className="w-3.5 h-3.5 text-[#F5D061]" />
              {lang === 'vi' ? 'Kéo thả cầu thủ trên sân' : 'Drag & drop nodes on pitch'}
            </span>
          </div>

          <div
            ref={pitchRef}
            onPointerMove={handlePointerMove}
            onPointerUp={() => setDraggingSlotId(null)}
            onPointerLeave={() => setDraggingSlotId(null)}
            className="keep-dark-surface relative w-full h-[475px] rounded-2xl bg-gradient-to-b from-[#0A261B] via-[#071D14] to-[#05140E] border-2 border-[#D4AF37]/50 overflow-hidden select-none touch-none shadow-2xl"
          >
            {/* Interactive Pitch Glow SVG: Heat Zones + Glowing Tactical Pass Lines */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <defs>
                <radialGradient id="tridentHeatGlow" cx="50%" cy="20%" r="42%">
                  <stop offset="0%" stopColor="rgba(245, 208, 97, 0.36)" />
                  <stop offset="50%" stopColor="rgba(56, 189, 248, 0.14)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </radialGradient>
              </defs>

              {/* Supersonic Attacking Heat Zone */}
              <ellipse cx="50" cy="22" rx="40" ry="20" fill="url(#tridentHeatGlow)" />

              {/* Pitch Lines */}
              <rect x="4" y="4" width="92" height="92" fill="none" stroke="rgba(245,208,97,0.32)" strokeWidth="0.6" />
              <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(245,208,97,0.28)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(245,208,97,0.28)" strokeWidth="0.5" />
              <rect x="22" y="4" width="56" height="15" fill="none" stroke="rgba(245,208,97,0.28)" strokeWidth="0.5" />
              <rect x="22" y="81" width="56" height="15" fill="none" stroke="rgba(245,208,97,0.28)" strokeWidth="0.5" />

              {/* Dynamic Glowing Pass Links between dragged nodes */}
              {TACTICAL_LINKS.map(([fromId, toId]) => {
                const a = slotMap.get(fromId);
                const b = slotMap.get(toId);
                if (!a || !b) return null;
                const isSelectedLink =
                  fromId === selectedSlotId || toId === selectedSlotId;
                return (
                  <line
                    key={`${fromId}-${toId}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={
                      isSelectedLink
                        ? 'rgba(245, 208, 97, 0.85)'
                        : 'rgba(56, 189, 248, 0.38)'
                    }
                    strokeWidth={isSelectedLink ? '0.8' : '0.45'}
                    className="animate-pitch-flow"
                  />
                );
              })}
            </svg>

            {lineup.map((slot) => {
              const player = playerMap.get(slot.playerId);
              const isSelected = selectedSlotId === slot.slotId;
              const isBeingDragged = draggingSlotId === slot.slotId;
              return (
                <div
                  key={slot.slotId}
                  onPointerDown={() => {
                    setSelectedSlotId(slot.slotId);
                    setDraggingSlotId(slot.slotId);
                  }}
                  onDoubleClick={() => {
                    if (player) setWalkoutPlayer(player);
                  }}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  className={`${
                    isBeingDragged ? '' : 'pitch-node-glide'
                  } absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-grab active:cursor-grabbing ${
                    isSelected ? 'scale-110 z-20' : 'z-10 hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 bg-[#060913] shadow-[0_0_20px_rgba(245,208,97,0.5)] ${
                      isSelected
                        ? 'border-[#F5D061] ring-4 ring-[#F5D061]/35'
                        : 'border-white/85'
                    }`}
                  >
                    {player && (
                      <PlayerAvatar
                        src={player.imageUrl}
                        name={player.name}
                        shirtNumber={player.shirtNumber}
                      />
                    )}
                  </div>
                  <div
                    style={{ backgroundColor: '#0B1120', color: '#FFFFFF', borderColor: '#D4AF37' }}
                    className="pitch-node-badge mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold whitespace-nowrap"
                  >
                    {player?.id !== 'yan-diomande' && (
                      <span style={{ color: '#F5D061' }} className="mr-1 font-black">
                        #{player?.shirtNumber ?? 0}
                      </span>
                    )}
                    <span style={{ color: '#FFFFFF' }}>{player?.name.split(' ').pop()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Slot Player Picker + Quick Walkout Trigger */}
        <div className="lg:col-span-5 glass-royal rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#F5D061]">
                  {lang === 'vi' ? 'Vị Trí Đang Chọn Trên Sân:' : 'Selected Tactical Slot:'}{' '}
                  <strong>{selectedSlotId}</strong>
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {lang === 'vi'
                    ? 'Đổi Cầu Thủ Vào Đội Hình Xuất Phát'
                    : 'Assign Player to Starting XI Slot'}
                </h3>
              </div>
              {selectedSlotPlayer && (
                <button
                  onClick={() => setWalkoutPlayer(selectedSlotPlayer)}
                  className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#060913] text-xs font-extrabold flex items-center gap-1 shadow whitespace-nowrap"
                >
                  <span>{lang === 'vi' ? 'Xem Hồ Sơ' : 'View Profile'}</span>
                </button>
              )}
            </div>

            <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
              {players.map((p) => {
                const inLineup = lineup.some((s) => s.playerId === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => replaceSlotPlayer(p.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      inLineup
                        ? 'bg-[#16203D]/90 border-[#F5D061]/60'
                        : 'bg-[#060913]/70 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37] shrink-0 bg-[#060913]">
                        <PlayerAvatar
                          src={p.imageUrl}
                          name={p.name}
                          shirtNumber={p.shirtNumber}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {p.id === 'yan-diomande' ? p.name : `#${p.shirtNumber} ${p.name}`}{' '}
                          <span className="text-[10px] font-bold text-[#F5D061]">
                            ({p.specificPositions.join('/')})
                          </span>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400">
                          {p.era} • G+A/90: {p.stats.gaPer90.toFixed(2)} • {p.stats.topSpeedKmh} km/h
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-1 rounded bg-[#D4AF37]/20 text-[#F5D061]">
                      {inLineup ? (lang === 'vi' ? 'Trên sân' : 'On Pitch') : lang === 'vi' ? 'Chọn' : 'Select'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#F5D061]" />
              {lang === 'vi'
                ? 'Nhấp đúp cầu thủ trên sân để mở Xem Hồ Sơ.'
                : 'Double-click any pitch node to View Profile.'}
            </span>
            <button
              onClick={() => setLineup(DEFAULT_PRESETS.squad_2026_supersonic)}
              className="text-[#F5D061] hover:underline flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {lang === 'vi' ? 'Đặt lại' : 'Reset'}
            </button>
          </div>
        </div>
      </div>

      {/* PART B: 10,000-ITERATION BIVARIATE POISSON MONTE CARLO ERA SIMULATOR */}
      <div className="glass-gold rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D4AF37]/30">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase text-[#F5D061] mb-1">
              <Dices className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? 'Mô Hình Xác Suất Bivariate Poisson & Hệ Số Ngược Dòng (N = 10.000 Trận)'
                  : 'Bivariate Poisson + Remontada Surge Engine (N = 10,000 Matches)'}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              {lang === 'vi'
                ? 'GIẢ LẬP ĐẠI CHIẾN XUYÊN KHÔNG GIỮA CÁC THẾ HỆ REAL MADRID'
                : 'CROSS-ERA MONTE CARLO SIMULATOR (1960 vs 2002 vs 2017 vs 2026/27)'}
            </h3>
          </div>

          <button
            onClick={runLive10000MonteCarlo}
            disabled={isSimulating || teamAId === teamBId}
            className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F5D061] disabled:opacity-50 text-[#060913] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isSimulating
                ? lang === 'vi'
                  ? 'Đang Chạy 10.000 Vòng Lặp...'
                  : 'Running 10,000 Trials...'
                : lang === 'vi'
                ? 'Chạy Lại 10.000 Vòng Lặp Monte Carlo'
                : 'Re-Run 10,000 Monte Carlo Trials'}
            </span>
          </button>
        </div>

        {/* Team A vs Team B Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#060913]/85 rounded-xl p-5 border border-[#D4AF37]/40">
            <label className="text-xs font-extrabold uppercase text-[#F5D061] block mb-2">
              {lang === 'vi' ? 'Chọn Thế Hệ Chủ Nhà (Đội A):' : 'Select Era Team A:'}
            </label>
            <select
              value={teamAId}
              onChange={(e) => {
                setTeamAId(e.target.value);
                setLiveSimResult(null);
              }}
              className="w-full p-3 rounded-xl bg-[#0D1326] border border-[#D4AF37]/50 text-white font-bold text-sm focus:outline-none"
            >
              {monteCarlo.eras.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name[lang]} —{' '}
                  {lang === 'vi' ? `Điểm sức mạnh ${e.eraRating}` : `Rating ${e.eraRating}`}
                </option>
              ))}
            </select>
            {eraA && (
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="font-mono text-[11px] text-emerald-400">
                  {lang === 'vi' ? `HLV trưởng: ${eraA.coach}` : `Head Coach: ${eraA.coach}`}
                </div>
                <div>{eraA.description[lang]}</div>
                <div className="font-bold text-[#F5D061]">
                  {lang === 'vi'
                    ? `λ Tấn công: ${eraA.lambdaAttack} | λ Phòng ngự: ${eraA.lambdaDefense} | Hệ số ngược dòng: ${eraA.remontadaFactor}x`
                    : `λ Attack: ${eraA.lambdaAttack} | λ Defense: ${eraA.lambdaDefense} | Remontada: ${eraA.remontadaFactor}x`}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#060913]/85 rounded-xl p-5 border border-sky-400/40">
            <label className="text-xs font-extrabold uppercase text-sky-500 block mb-2">
              {lang === 'vi' ? 'Chọn Thế Hệ Đối Đầu (Đội B):' : 'Select Era Team B:'}
            </label>
            <select
              value={teamBId}
              onChange={(e) => {
                setTeamBId(e.target.value);
                setLiveSimResult(null);
              }}
              className="w-full p-3 rounded-xl bg-[#0D1326] border border-sky-400/50 text-white font-bold text-sm focus:outline-none"
            >
              {monteCarlo.eras.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name[lang]} —{' '}
                  {lang === 'vi' ? `Điểm sức mạnh ${e.eraRating}` : `Rating ${e.eraRating}`}
                </option>
              ))}
            </select>
            {eraB && (
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="font-mono text-[11px] text-emerald-400">
                  {lang === 'vi' ? `HLV trưởng: ${eraB.coach}` : `Head Coach: ${eraB.coach}`}
                </div>
                <div>{eraB.description[lang]}</div>
                <div className="font-bold text-sky-500">
                  {lang === 'vi'
                    ? `λ Tấn công: ${eraB.lambdaAttack} | λ Phòng ngự: ${eraB.lambdaDefense} | Hệ số ngược dòng: ${eraB.remontadaFactor}x`
                    : `λ Attack: ${eraB.lambdaAttack} | λ Defense: ${eraB.lambdaDefense} | Remontada: ${eraB.remontadaFactor}x`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Simulation Output Dashboard */}
        {teamAId === teamBId ? (
          <div className="p-6 rounded-xl bg-[#060913]/90 border border-amber-500/40 text-center text-sm text-amber-500 font-bold flex items-center justify-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <span>
              {lang === 'vi'
                ? 'Vui lòng chọn 2 thế hệ khác nhau để chạy mô phỏng đối đầu xuyên không.'
                : 'Please select two distinct Real Madrid eras to simulate a cross-era clash.'}
            </span>
          </div>
        ) : (
          currentMatchup && (
            <div className="space-y-6">
              {/* Win / Draw / Loss Probability Bar */}
              <div className="bg-[#060913]/90 rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-3 text-center mb-4">
                  <div>
                    <div className="text-xs font-bold uppercase text-[#F5D061]">
                      {eraA?.shortName} {lang === 'vi' ? 'Thắng' : 'Win'}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-[#F5D061]">
                      {currentMatchup.winProbA}%
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      xG: {currentMatchup.avgGoalsA}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400">
                      {lang === 'vi' ? 'Hòa (90 Phút)' : 'Draw (90 Mins)'}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-200">
                      {currentMatchup.drawProb}%
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      Cov(λ₃) = {currentMatchup.covarianceLambda3}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-sky-500">
                      {eraB?.shortName} {lang === 'vi' ? 'Thắng' : 'Win'}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-sky-500">
                      {currentMatchup.winProbB}%
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      xG: {currentMatchup.avgGoalsB}
                    </div>
                  </div>
                </div>

                <div className="w-full h-4 rounded-full bg-slate-900 overflow-hidden flex border border-white/15">
                  <div
                    className="bg-[#D4AF37] h-full progress-bar-fill"
                    style={{ width: `${currentMatchup.winProbA}%` }}
                  />
                  <div
                    className="bg-slate-600 h-full progress-bar-fill"
                    style={{ width: `${currentMatchup.drawProb}%` }}
                  />
                  <div
                    className="bg-sky-500 h-full progress-bar-fill"
                    style={{ width: `${currentMatchup.winProbB}%` }}
                  />
                </div>
              </div>

              {/* Top 6 Most Likely Exact Scorelines */}
              <div>
                <div className="text-xs font-extrabold uppercase text-[#F5D061] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {lang === 'vi'
                      ? `6 Tỉ Số Chính Xác Có Xác Suất Cao Nhất (${eraA?.shortName} – ${eraB?.shortName}):`
                      : `Top 6 Most Probable Exact Scorelines (${eraA?.shortName} – ${eraB?.shortName}):`}
                  </span>
                </div>
                <div
                  key={`${teamAId}-${teamBId}-${currentMatchup.winProbA}`}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
                >
                  {currentMatchup.topScorelines.map((sc, i) => (
                    <div
                      key={sc.score}
                      style={{ '--stagger-delay': `${i * 45}ms` } as React.CSSProperties}
                      className={`royal-card-hover animate-card-stagger p-3.5 rounded-xl border text-center ${
                        i === 0
                          ? 'bg-[#16203D] border-[#F5D061] shadow-md'
                          : 'bg-[#060913]/80 border-white/10'
                      }`}
                    >
                      <div className="text-xl font-extrabold text-white">{sc.score}</div>
                      <div className="text-xs font-bold text-[#F5D061] mt-1">
                        {sc.probabilityPct}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {walkoutPlayer && (
        <PlayerWalkoutModal
          player={walkoutPlayer}
          lang={lang}
          onClose={() => setWalkoutPlayer(null)}
        />
      )}
    </section>
  );
};
