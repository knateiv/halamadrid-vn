import React, { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Flame, Swords, TrendingUp, Zap } from 'lucide-react';
import { ElClasicoMatch, Language, RemontadaAnalytics } from '../types/database';

interface ClasicoRemontadaSectionProps {
  clasicoHistory: ElClasicoMatch[];
  remontadaAnalytics: RemontadaAnalytics;
  headToHead: {
    totalOfficialMatches: number;
    realMadridWins: number;
    barcelonaWins: number;
    draws: number;
    realMadridGoals: number;
    barcelonaGoals: number;
    latestResult: string;
  };
  lang: Language;
}

export const ClasicoRemontadaSection: React.FC<ClasicoRemontadaSectionProps> = ({
  clasicoHistory,
  remontadaAnalytics,
  headToHead,
  lang,
}) => {
  const CARDS_PER_PAGE = 6;
  const latestClasico = clasicoHistory[0];

  // State for Season Jump & 6-Card Window Navigation across all 265 matches
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [customStartIndex, setCustomStartIndex] = useState<number | null>(null);

  const totalMatches = clasicoHistory.length;
  const totalPages = Math.max(1, Math.ceil(totalMatches / CARDS_PER_PAGE));

  // Extract all unique seasons in chronological order (newest 2026/27 -> oldest 1901/02)
  const seasonOptions = useMemo(() => {
    const map = new Map<
      string,
      { season: string; count: number; firstIndex: number; topMatchNum: number }
    >();
    clasicoHistory.forEach((m, idx) => {
      const s = m.season ?? m.date.slice(-4);
      const mNum = m.matchNumber ?? totalMatches - idx;
      const existing = map.get(s);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(s, { season: s, count: 1, firstIndex: idx, topMatchNum: mNum });
      }
    });
    return Array.from(map.values());
  }, [clasicoHistory, totalMatches]);

  // Compute the 6 cards to display (NEVER fewer than 6 cards when totalMatches >= 6)
  const displayedWindow = useMemo(() => {
    if (totalMatches === 0) {
      return {
        items: [] as Array<{
          match: ElClasicoMatch;
          rankNumber: number;
          isSeasonMatch: boolean;
          isAdjacentFill: boolean;
        }>,
        rangeStart: 0,
        rangeEnd: 0,
      };
    }

    // CASE 1: A specific season is selected in the top-right Season Selector ("Jump & Auto-Fill 6 Cards")
    if (selectedSeason !== 'ALL') {
      const seasonIndices: number[] = [];
      clasicoHistory.forEach((m, idx) => {
        if ((m.season ?? '') === selectedSeason) {
          seasonIndices.push(idx);
        }
      });

      if (seasonIndices.length > 0) {
        const firstSeasonIdx = seasonIndices[0];
        const lastSeasonIdx = seasonIndices[seasonIndices.length - 1];
        const pickedIndices: Array<{ idx: number; isSeasonMatch: boolean }> = seasonIndices
          .slice(0, CARDS_PER_PAGE)
          .map((idx) => ({ idx, isSeasonMatch: true }));

        // Fill remaining slots with immediately preceding El Clásico matches (chronologically older: idx > lastSeasonIdx)
        let cursor = lastSeasonIdx + 1;
        while (pickedIndices.length < CARDS_PER_PAGE && cursor < totalMatches) {
          pickedIndices.push({ idx: cursor, isSeasonMatch: false });
          cursor += 1;
        }

        // If at the very end of the 265-match archive (e.g. 1901/02 #1), backfill with adjacent matches right before firstSeasonIdx
        let backCursor = firstSeasonIdx - 1;
        while (pickedIndices.length < CARDS_PER_PAGE && backCursor >= 0) {
          pickedIndices.push({ idx: backCursor, isSeasonMatch: false });
          backCursor -= 1;
        }

        const items = pickedIndices.map(({ idx, isSeasonMatch }) => ({
          match: clasicoHistory[idx],
          rankNumber: clasicoHistory[idx].matchNumber ?? totalMatches - idx,
          isSeasonMatch,
          isAdjacentFill: !isSeasonMatch,
        }));

        return {
          items,
          rangeStart: items[0]?.rankNumber ?? 0,
          rangeEnd: items[items.length - 1]?.rankNumber ?? 0,
        };
      }
    }

    // CASE 2: Standard pagination or continuous timeline stepping after jumping to a season
    let startIdx =
      customStartIndex !== null ? customStartIndex : (currentPage - 1) * CARDS_PER_PAGE;

    // Last-page balance rule: if startIdx + 6 exceeds totalMatches (e.g. page 45 of 265 matches),
    // clamp startIdx to totalMatches - 6 (= 259, showing the 6 oldest matches #6 down to #1) so all 6 grid slots are full.
    if (totalMatches >= CARDS_PER_PAGE && startIdx + CARDS_PER_PAGE > totalMatches) {
      startIdx = totalMatches - CARDS_PER_PAGE;
    }
    startIdx = Math.max(0, startIdx);

    const slice = clasicoHistory.slice(startIdx, startIdx + CARDS_PER_PAGE);
    const items = slice.map((m, offset) => ({
      match: m,
      rankNumber: m.matchNumber ?? totalMatches - (startIdx + offset),
      isSeasonMatch: false,
      isAdjacentFill: false,
    }));

    return {
      items,
      rangeStart: items[0]?.rankNumber ?? 0,
      rangeEnd: items[items.length - 1]?.rankNumber ?? 0,
    };
  }, [clasicoHistory, totalMatches, selectedSeason, currentPage, customStartIndex]);

  const handleSelectSeason = (seasonValue: string) => {
    setSelectedSeason(seasonValue);
    if (seasonValue === 'ALL') {
      setCustomStartIndex(null);
      setCurrentPage(1);
      return;
    }
    const found = seasonOptions.find((s) => s.season === seasonValue);
    if (found) {
      const clampedStart = Math.min(
        found.firstIndex,
        Math.max(0, totalMatches - CARDS_PER_PAGE)
      );
      setCustomStartIndex(clampedStart);
      setCurrentPage(Math.min(totalPages, Math.floor(found.firstIndex / CARDS_PER_PAGE) + 1));
    }
  };

  const handlePrevPage = () => {
    if (customStartIndex !== null || selectedSeason !== 'ALL') {
      const baseIdx =
        customStartIndex !== null ? customStartIndex : (currentPage - 1) * CARDS_PER_PAGE;
      const nextStart = Math.max(0, baseIdx - CARDS_PER_PAGE);
      setSelectedSeason('ALL');
      setCustomStartIndex(nextStart === 0 ? null : nextStart);
      setCurrentPage(Math.floor(nextStart / CARDS_PER_PAGE) + 1);
      return;
    }
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    if (customStartIndex !== null || selectedSeason !== 'ALL') {
      const baseIdx =
        customStartIndex !== null ? customStartIndex : (currentPage - 1) * CARDS_PER_PAGE;
      const maxStart = Math.max(0, totalMatches - CARDS_PER_PAGE);
      const nextStart = Math.min(maxStart, baseIdx + CARDS_PER_PAGE);
      setSelectedSeason('ALL');
      if (nextStart >= maxStart) {
        setCustomStartIndex(null);
        setCurrentPage(totalPages);
      } else {
        setCustomStartIndex(nextStart);
        setCurrentPage(Math.floor(nextStart / CARDS_PER_PAGE) + 1);
      }
      return;
    }
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const isAtStart =
    selectedSeason === 'ALL'
      ? (customStartIndex !== null ? customStartIndex <= 0 : currentPage <= 1)
      : (customStartIndex ?? 0) <= 0;

  const isAtEnd =
    selectedSeason === 'ALL'
      ? (customStartIndex !== null
          ? customStartIndex >= totalMatches - CARDS_PER_PAGE
          : currentPage >= totalPages)
      : (customStartIndex ?? 0) >= totalMatches - CARDS_PER_PAGE;

  return (
    <section
      id="clasico"
      className="heavy-section-deferred py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-semibold uppercase tracking-widest mb-3">
            <Swords className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi'
                ? 'Phân Hệ 4 • Siêu Kinh Điển & Toán Học Phút Bù Giờ'
                : 'Module 4 • El Clásico & Remontada Analytics'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-royal font-extrabold text-white tracking-tight">
            {lang === 'vi'
              ? 'ĐẠI CHIẾN EL CLÁSICO & CHỨNG MINH "DNA REMONTADA"'
              : 'EL CLÁSICO ARCHIVE & "DNA REMONTADA" STATISTICAL PROOF'}
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-xl">
          {lang === 'vi'
            ? "Cập nhật tới chiến thắng El Clásico 2–1 tại Camp Nou ngày 26/10/2026 với cú đúp của Kylian Mbappé (41', 87' — Cột mốc 100 bàn cho Real Madrid) cùng kiểm định Chi-Square chứng minh sự bùng nổ bàn thắng phút 76'–90+'."
            : "Updated through the 2–1 El Clásico away victory at Camp Nou on October 26, 2026 (Kylian Mbappé brace 41', 87' — 100th Real Madrid goal) alongside Chi-Square proof of the 76'–90+' Remontada surge."}
        </p>
      </div>

      {/* LATEST EL CLÁSICO 26/10/2026 BANNER + ALL-TIME HEAD TO HEAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* 26/10/2026 El Clásico Highlight */}
        {latestClasico && (
          <div className="lg:col-span-7 glass-gold rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#060913] font-mono text-xs font-extrabold uppercase">
                {lang === 'vi'
                  ? 'Cập Nhật Mới Nhất • 26/10/2026 (Vòng 10 La Liga)'
                  : 'Latest Official Result • 26/10/2026 (La Liga)'}
              </span>
              <span className="text-xs font-mono font-bold text-[#F5D061]">
                {latestClasico.venue}
              </span>
            </div>

            <div className="bg-[#060913]/85 rounded-2xl p-5 border border-[#D4AF37]/40 mb-4">
              <div className="grid grid-cols-3 items-center text-center">
                <div>
                  <div className="text-lg sm:text-xl font-royal font-extrabold text-slate-300">
                    FC BARCELONA
                  </div>
                  <div className="text-[11px] font-mono text-rose-400 font-bold mt-1">
                    ⚽ Raphinha (61&apos;)
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'vi' ? 'Kiến tạo: Pedri (phạt góc ngắn)' : 'Assist: Pedri (short corner)'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-5xl font-mono font-extrabold text-[#F5D061]">
                    1 – 2
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mt-1">
                    Camp Nou • FT
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-royal font-extrabold text-white">
                    REAL MADRID
                  </div>
                  <div className="text-[11px] font-mono text-[#F5D061] font-bold mt-1">
                    ⚽ Mbappé (41&apos;, 87&apos; — 100G)
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    {lang === 'vi'
                      ? "Kiến tạo 87': Eduardo Camavinga (#6)"
                      : "87' Assist: Eduardo Camavinga (#6)"}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed mb-4">
              {latestClasico.summary[lang]}
            </p>

            {/* Match Facts, Official Lineup & Milestone Strip from realmadrid.com */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-[#060913]/80 rounded-xl p-3 border border-[#D4AF37]/30">
                <div className="text-[10px] uppercase font-extrabold text-[#F5D061]">
                  {lang === 'vi' ? 'Cột Mốc 100 Bàn & Kiến Tạo' : '100-Goal Milestone & Assist'}
                </div>
                <div className="text-[11px] text-slate-200 mt-1 leading-snug">
                  {lang === 'vi'
                    ? "Kylian Mbappé (#10) lập cú đúp (41', 87') cán mốc 100 bàn cho Real Madrid & san bằng kỷ lục 59 bàn/năm dương lịch của CR7 • Kiến tạo bàn 87': Eduardo Camavinga (#6)."
                    : "Kylian Mbappé (#10) brace (41', 87') reaches 100 Real Madrid goals & equals CR7’s 59 goals in a calendar year • 87' winning assist: Eduardo Camavinga (#6)."}
                </div>
              </div>
              <div className="bg-[#060913]/80 rounded-xl p-3 border border-[#D4AF37]/30">
                <div className="text-[10px] uppercase font-extrabold text-sky-400">
                  {lang === 'vi'
                    ? 'Đội Hình Xuất Phát (realmadrid.com)'
                    : 'Official Starting XI (realmadrid.com)'}
                </div>
                <div className="text-[11px] text-slate-200 mt-1 leading-snug">
                  13. Lunin; 8. Valverde (61&apos; Dumfries), 16. Konaté, 4. Huijsen, 17. Cucurella;
                  14. Tchouaméni, 20. Bernardo Silva (79&apos; Camavinga), 5. Bellingham; 25. Yan
                  Diomande (90+3&apos; Carlos Espí), 15. Arda Güler (90+3&apos; Trent), 10. Mbappé.
                </div>
              </div>
              <div className="bg-[#060913]/80 rounded-xl p-3 border border-[#D4AF37]/30">
                <div className="text-[10px] uppercase font-extrabold text-emerald-400">
                  {lang === 'vi' ? 'Dấu Ấn Lunin & Cục Diện BXH' : 'Lunin Heroics & Standings'}
                </div>
                <div className="text-[11px] text-slate-200 mt-1 leading-snug">
                  {lang === 'vi'
                    ? 'Andriy Lunin (#13) bắt chính cản phá 4 cú sút hiểm hóc giúp Real Madrid thắng Barca 2–1 tại Camp Nou, đạt 24 điểm và thu hẹp khoảng cách với ngôi đầu xuống 3 điểm.'
                    : 'Andriy Lunin (#13) made 4 crucial saves as Real Madrid beat Barcelona 2–1 at Camp Nou, reaching 24 points (within 3 points of the top).'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All-Time El Clásico Head-to-Head Balance (265 Official Matches: 107 RM Wins - 52 Draws - 106 Barca Wins) */}
        <div className="lg:col-span-5 glass-royal rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {lang === 'vi'
                ? `Thống Kê Đối Đầu Chính Thức (${headToHead.totalOfficialMatches} Trận)`
                : `Official Head-to-Head (${headToHead.totalOfficialMatches} Matches)`}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {lang === 'vi'
                ? 'Real Madrid nắm giữ ưu thế lịch sử qua 265 trận El Clásico chính thức cả về số trận thắng (107 vs 106) lẫn tổng số bàn thắng.'
                : 'Real Madrid holds the all-time historical edge across 265 official El Clásico matches in both victories (107 vs 106) and goals scored.'}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center mb-6">
              <div className="bg-[#060913] p-4 rounded-xl border border-[#D4AF37]/40">
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#F5D061]">
                  {headToHead.realMadridWins}
                </div>
                <div className="text-[11px] uppercase text-slate-300 mt-1 font-medium">
                  {lang === 'vi' ? 'REAL THẮNG' : 'REAL WINS'}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1">
                  40.4%
                </div>
              </div>
              <div className="bg-[#060913] p-4 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-300">
                  {headToHead.draws}
                </div>
                <div className="text-[11px] uppercase text-slate-400 mt-1 font-medium">
                  {lang === 'vi' ? 'HÒA' : 'DRAWS'}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  19.6%
                </div>
              </div>
              <div className="bg-[#060913] p-4 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-rose-400">
                  {headToHead.barcelonaWins}
                </div>
                <div className="text-[11px] uppercase text-slate-400 mt-1 font-medium">
                  {lang === 'vi' ? 'BARCA THẮNG' : 'BARCA WINS'}
                </div>
                <div className="text-[11px] font-mono text-rose-400/90 mt-1">
                  40.0%
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#F5D061] font-bold">
                Real Madrid: {headToHead.realMadridGoals} {lang === 'vi' ? 'bàn' : 'goals'}
              </span>
              <span className="text-rose-400 font-bold">
                Barcelona: {headToHead.barcelonaGoals} {lang === 'vi' ? 'bàn' : 'goals'}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#060913] overflow-hidden flex border border-white/10">
              <div className="bg-[#D4AF37] h-full" style={{ width: '40.4%' }} />
              <div className="bg-slate-600 h-full" style={{ width: '19.6%' }} />
              <div className="bg-rose-600 h-full" style={{ width: '40.0%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 15-MINUTE GOAL DISTRIBUTION & DNA REMONTADA PROOF */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-7 glass-royal rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F5D061]" />
                <span>
                  {lang === 'vi'
                    ? 'Phân Phối Bàn Thắng Theo Khung 15 Phút (Chứng Minh DNA Remontada)'
                    : '15-Minute Knockout Goal Distribution (DNA Remontada Proof)'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'vi'
                  ? `Kiểm định Chi-Square: χ² = ${remontadaAnalytics.chiSquareStat} (p = ${remontadaAnalytics.pValue} < 0.0001) bác bỏ phân phối đều.`
                  : `Chi-Square Test: χ² = ${remontadaAnalytics.chiSquareStat} (p = ${remontadaAnalytics.pValue} < 0.0001) confirming extreme late-goal surge.`}
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-[#16203D] border border-[#D4AF37]/40 font-mono text-xs font-bold text-[#F5D061]">
              76&apos;–90+&apos;: {remontadaAnalytics.lateWindowSharePct}%
            </span>
          </div>

          <div className="space-y-4">
            {remontadaAnalytics.intervals.map((item) => {
              const isLate = item.window === "76'–90+'";
              return (
                <div key={item.window} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-mono font-bold ${
                        isLate ? 'text-[#F5D061] text-sm' : 'text-white'
                      }`}
                    >
                      {item.window} {isLate && '🔥 (DNA REMONTADA ZONE)'}
                    </span>
                    <span className="font-mono text-slate-300">
                      <strong className="text-white">{item.goals}</strong>{' '}
                      {lang === 'vi' ? 'bàn' : 'goals'} ({item.sharePct}%)
                    </span>
                  </div>
                  <div className="w-full h-4 rounded-lg bg-[#060913] overflow-hidden border border-white/10 p-0.5">
                    <div
                      className={`h-full rounded-md progress-bar-fill ${
                        isLate
                          ? 'bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-amber-300 shadow-[0_0_15px_rgba(245,208,97,0.6)]'
                          : 'bg-sky-500/70'
                      }`}
                      style={{ width: `${Math.min(item.sharePct * 3.1, 100)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 italic">{item.notableMoments}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Iconic Remontada & Clásico Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#F5D061] flex items-center gap-2">
            <Flame className="w-4 h-4" />
            <span>
              {lang === 'vi'
                ? 'Những Cú Ngược Dòng Điển Hình Xác Suất < 5%:'
                : 'Iconic Low-Probability Remontada Case Studies:'}
            </span>
          </div>
          {remontadaAnalytics.remontadaMatches.map((rm) => (
            <div
              key={`${rm.year}-${rm.minute}`}
              className="royal-card-hover bg-[#0D1326] rounded-xl p-4 border border-white/10 hover:border-[#D4AF37]/50"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#F5D061] font-bold">
                  {rm.year} • Phút {rm.minute}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Win Prob min: {rm.winProbBeforeGoalPct}% → 100%
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{rm.match}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rm.story[lang]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMPLETE 265-MATCH EL CLÁSICO CHRONICLE (1902–2026) WITH JUMP & AUTO-FILL 6 CARDS */}
      <div className="space-y-5">
        {/* Top Bar: Title on Left + Season Selector & Pagination Controls on Top-Right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#121212] border border-white/[0.07] rounded-2xl p-4 sm:p-5">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F5D061] shrink-0" />
              <span>
                {lang === 'vi'
                  ? `Biên Niên Sử Toàn Bộ ${totalMatches} Trận El Clásico (1902–2026)`
                  : `Complete Chronicle of All ${totalMatches} Official El Clásico Matches (1902–2026)`}
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              {selectedSeason !== 'ALL' ? (
                lang === 'vi' ? (
                  <>
                    Đang lọc mùa <span className="font-mono text-amber-400 font-semibold">{selectedSeason}</span> — tự động điền tiếp các trận El Clásico liền kề trước đó để hiển thị đủ 6 ô cân đối (Trận{' '}
                    <span className="font-mono text-neutral-200">
                      #{displayedWindow.rangeStart} đến #{displayedWindow.rangeEnd}
                    </span>
                    ).
                  </>
                ) : (
                  <>
                    Showing season <span className="font-mono text-amber-400 font-semibold">{selectedSeason}</span> — auto-filled with preceding matches to maintain a full 6-card grid (Matches{' '}
                    <span className="font-mono text-neutral-200">
                      #{displayedWindow.rangeStart} to #{displayedWindow.rangeEnd}
                    </span>
                    ).
                  </>
                )
              ) : lang === 'vi' ? (
                <>
                  Đang hiển thị cửa sổ 6 trận:{' '}
                  <span className="font-mono text-amber-400 font-semibold">
                    Trận #{displayedWindow.rangeStart} đến #{displayedWindow.rangeEnd}
                  </span>{' '}
                  trong tổng số <span className="font-mono text-white">{totalMatches}</span> trận chính thức (107 Thắng • 52 Hòa • 106 Thua).
                </>
              ) : (
                <>
                  Displaying 6-match window:{' '}
                  <span className="font-mono text-amber-400 font-semibold">
                    Match #{displayedWindow.rangeStart} to #{displayedWindow.rangeEnd}
                  </span>{' '}
                  of <span className="font-mono text-white">{totalMatches}</span> official matches (107W • 52D • 106L).
                </>
              )}
            </p>
          </div>

          {/* Right Controls: Season Selector Dropdown + Prev/Next Page Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Season Selector (Khung Chọn Mùa Giải) */}
            <div className="flex items-center gap-2 bg-[#0A0A0A] border border-white/[0.1] rounded-xl px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <label
                htmlFor="clasico-season-select"
                className="text-[11px] font-mono text-neutral-400 whitespace-nowrap"
              >
                {lang === 'vi' ? 'Mùa giải:' : 'Season:'}
              </label>
              <select
                id="clasico-season-select"
                value={selectedSeason}
                onChange={(e) => handleSelectSeason(e.target.value)}
                className="bg-[#0A0A0A] text-white font-mono text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL">
                  {lang === 'vi'
                    ? `Tất cả mùa (${totalMatches} trận)`
                    : `All Seasons (${totalMatches} matches)`}
                </option>
                {seasonOptions.map((opt) => (
                  <option key={opt.season} value={opt.season}>
                    {lang === 'vi'
                      ? `Mùa ${opt.season} (${opt.count} trận — #${opt.topMatchNum})`
                      : `${opt.season} (${opt.count} matches — #${opt.topMatchNum})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Prev / Page Indicator / Next */}
            <div className="flex items-center gap-1.5 bg-[#0A0A0A] border border-white/[0.1] rounded-xl p-1">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={isAtStart}
                className="px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 text-neutral-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-35 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Trước' : 'Prev'}</span>
              </button>

              <span className="px-2.5 py-1 font-mono text-[11px] text-neutral-300 border-x border-white/[0.07]">
                {lang === 'vi' ? 'Trang' : 'Page'}{' '}
                <strong className="text-white">{currentPage}</strong> / {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={isAtEnd}
                className="px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 text-neutral-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-35 disabled:pointer-events-none transition-colors"
              >
                <span>{lang === 'vi' ? 'Tiếp' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 6-Card Equal-Height Grid (3 columns × 2 rows — ALWAYS 6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {displayedWindow.items.map(({ match: m, rankNumber, isSeasonMatch, isAdjacentFill }) => {
            const isRealWin = m.realGoals > m.barcaGoals;
            const isDraw = m.realGoals === m.barcaGoals;

            return (
              <div
                key={m.id}
                className={`h-full rounded-xl p-5 flex flex-col justify-between transition-colors ${
                  isSeasonMatch
                    ? 'border border-amber-500/40 bg-white/[0.03] shadow-[0_0_25px_rgba(245,158,11,0.06)]'
                    : 'bg-[#121212] border border-white/[0.07] hover:border-white/[0.15]'
                }`}
              >
                {/* Top & Middle Content */}
                <div>
                  {/* Row 1: Match # + Date + Competition/Round */}
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-neutral-400 mb-2">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-300 text-[10px]">
                        #{rankNumber}
                      </span>
                      <span>{m.date}</span>
                    </span>
                    <span className="text-[#D4AF37] truncate text-right">{m.competition}</span>
                  </div>

                  {/* Optional Season Highlight or Adjacent Match Tag when filtering by Season */}
                  {selectedSeason !== 'ALL' && (
                    <div className="mb-2 flex items-center justify-between gap-2">
                      {isSeasonMatch ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px]">
                          ★ {lang === 'vi' ? `Mùa chọn: ${m.season}` : `Selected Season: ${m.season}`}
                        </span>
                      ) : isAdjacentFill ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-neutral-400 font-mono text-[10px]">
                          {lang === 'vi'
                            ? `Trận liền kề trước đó (${m.season})`
                            : `Preceding Match (${m.season})`}
                        </span>
                      ) : null}
                      <span className="text-[10px] font-mono text-neutral-500 truncate">
                        {m.venue}
                      </span>
                    </div>
                  )}

                  {/* Row 2: Scoreline + Result Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="text-lg font-mono font-extrabold text-white tracking-tight">
                      {m.score}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold shrink-0 ${
                        isRealWin
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isDraw
                          ? 'bg-neutral-500/10 text-neutral-300 border border-white/[0.1]'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isRealWin
                        ? lang === 'vi'
                          ? 'REAL THẮNG'
                          : 'REAL WIN'
                        : isDraw
                        ? lang === 'vi'
                          ? 'HÒA'
                          : 'DRAW'
                        : lang === 'vi'
                        ? 'BARCA THẮNG'
                        : 'BARCA WIN'}
                    </span>
                  </div>

                  {/* Row 3: Goal & Match Flow Summary (No Starting XI Lineup) */}
                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    {m.summary[lang]}
                  </p>
                </div>

                {/* Bottom Row: MVP */}
                <div className="pt-3 border-t border-white/[0.07] text-[11px] font-mono text-[#F5D061] flex items-center justify-between gap-2">
                  <span className="truncate">MVP: {m.mvp}</span>
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
