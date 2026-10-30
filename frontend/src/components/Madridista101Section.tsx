import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Crown, Heart, Music, Shield, Trophy, X } from 'lucide-react';
import { ClubLeader, Language } from '../types/database';
import { PlayerAvatar } from './PlayerAvatar';
import { TiltCard } from './TiltCard';

interface Madridista101SectionProps {
  leaders: ClubLeader[];
  lang: Language;
}

const ANTHEM_STANZAS = [
  {
    es: 'Historia que tú hiciste,\nhistoria por hacer,\nporque nadie resiste\ntus ganas de vencer.',
    vi: 'Lịch sử hào hùng Người đã viết nên,\nVà trang sử vàng còn đang tiếp bước,\nBởi chẳng thế lực nào ngăn nổi\nKhát vọng chiến thắng cháy bỏng trong Người.',
    en: 'History that you have made,\nhistory yet to be made,\nbecause nobody can resist\nyour desire to win.',
  },
  {
    es: 'Ya salen las estrellas,\nmi viejo Chamartín,\nde lejos y de cerca\nnos traes hasta aquí.',
    vi: 'Những vì tinh tú đã bước ra sân,\nÔi thánh địa Chamartín thân thương,\nTừ muôn phương xa xôi hay gần gũi,\nNgười quy tụ chúng tôi về nơi đây.',
    en: 'Now the stars are coming out,\nmy old Chamartín,\nfrom far and from near\nyou bring us all right here.',
  },
  {
    es: 'Llevo tu camiseta\npegada al corazón,\nlos días que tú juegas\nson todo lo que soy.',
    vi: 'Tôi khoác lên mình màu áo Trắng,\nÔm trọn sát nhịp đập con tim,\nMỗi ngày có Real Madrid xung trận,\nĐó là tất cả lẽ sống của đời tôi.',
    en: 'I wear your white shirt\nclose to my beating heart,\nthe days that you take the pitch\nare everything that I am.',
  },
  {
    es: '¡Hala Madrid! ...y nada más,\n¡y nada más!\n¡Hala Madrid!',
    vi: 'Tiến lên Madrid! ...Và không gì khác,\nChẳng cần điều gì hơn thế nữa!\nHala Madrid!',
    en: 'Hala Madrid! ...and nothing more,\nand nothing more!\nHala Madrid!',
  },
];

export const Madridista101Section: React.FC<Madridista101SectionProps> = ({ leaders, lang }) => {
  const [activeStanza, setActiveStanza] = useState<number>(0);
  const [selectedLeader, setSelectedLeader] = useState<ClubLeader | null>(null);

  useEffect(() => {
    if (!selectedLeader) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLeader(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedLeader]);

  return (
    <section
      id="madridista101"
      className="heavy-section-deferred py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-semibold uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi'
                ? 'Phân Hệ 6 • Bản Sắc Văn Hóa & Những Bộ Óc Vĩ Đại'
                : 'Module 6 • Club Culture, Patriarchs & Anthem'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'vi'
              ? 'CẨM NANG MADRIDISTA 101: CHỦ TỊCH, HLV & BÀI CA HALA MADRID'
              : 'MADRIDISTA 101: PRESIDENTS, ICONIC MANAGERS & ROYAL ANTHEM'}
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-xl">
          {lang === 'vi'
            ? 'Triết lý Señorío (Phong thái Quý tộc Hoàng gia), chân dung 7 vị Chủ tịch & Huấn luyện viên vĩ đại nhất cùng bài thánh ca "Hala Madrid y Nada Más".'
            : 'The philosophy of Señorío, the 7 legendary Presidents & Managers, and the immortal La Décima anthem "Hala Madrid y Nada Más".'}
        </p>
      </div>

      {/* 3 Pillars of Madridismo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div className="glass-royal rounded-2xl p-6">
          <Crown className="w-7 h-7 text-[#F5D061] mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">
            {lang === 'vi' ? '1. Señorío (Phong Thái Hoàng Gia)' : '1. El Señorío (Royal Nobility)'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'vi'
              ? 'Tôn trọng đối thủ, cao thượng trong chiến thắng, kiêu hãnh trong nghịch cảnh và đặt biểu tượng CLB lên trên mọi cá nhân.'
              : 'Chivalry in victory, dignity in adversity, respect for every opponent, and placing the Royal crest above any individual.'}
          </p>
        </div>

        <div className="glass-royal rounded-2xl p-6">
          <Heart className="w-7 h-7 text-rose-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">
            {lang === 'vi' ? '2. Hasta El Final (Chiến Đấu Đến Cùng)' : '2. Hasta El Final, Vamos Real'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'vi'
              ? 'Khẩu hiệu bất diệt của các Madridista: Khi tiếng còi mãn cuộc chưa vang lên tại Bernabéu, Real Madrid chưa bao giờ đầu hàng.'
              : 'The eternal creed of Madridismo: as long as there is a single second left on the Bernabéu clock, Real Madrid never surrenders.'}
          </p>
        </div>

        <div className="glass-royal rounded-2xl p-6">
          <Shield className="w-7 h-7 text-sky-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">
            {lang === 'vi' ? '3. Mô Hình Socios (Sở Hữu Bởi CĐV)' : '3. Socios-Owned Since 1902'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'vi'
              ? 'Suốt hơn 124 năm lịch sử, Real Madrid thuộc quyền sở hữu của hơn 95.000 hội viên (Socios), không thuộc về bất kỳ tỷ phú hay quỹ đầu tư nào.'
              : 'For over 124 years, Real Madrid has remained 100% owned by its 95,000+ club members (Socios).'}
          </p>
        </div>
      </div>

      {/* 7 PRESIDENTS & MANAGERS HALL OF FAME */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#F5D061]" />
          <span>
            {lang === 'vi'
              ? 'Đền Hùng Chủ Tịch & Huấn Luyện Viên Vĩ Đại (7 Kiến Trúc Sư Đế Chế)'
              : 'Hall of Patriarchs: Legendary Presidents & Managers'}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {leaders.map((leader, idx) => (
            <TiltCard
              key={leader.id}
              onClick={() => setSelectedLeader(leader)}
              style={{ '--stagger-delay': `${idx * 45}ms` } as React.CSSProperties}
              className="royal-card-hover animate-card-stagger cursor-pointer group bg-[#0D1326]/90 rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/60 flex flex-col justify-between"
            >
              <div>
                <div className="keep-dark-surface relative h-64 bg-[#060913] overflow-hidden">
                  <PlayerAvatar
                    src={leader.imageUrl}
                    name={leader.name}
                    position={leader.role[lang]}
                    className="w-full h-full object-cover object-[center_top] royal-portrait-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-black/20" />
                  {leader.id === 'jose-mourinho' && (
                    <div className="absolute top-3 left-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] px-2 py-0.5 rounded-md backdrop-blur-sm shadow">
                      {lang === 'vi' ? '🟢 HLV ĐƯƠNG NHIỆM 2026/27' : '🟢 HEAD COACH 2026/27'}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#D4AF37] text-[#060913] font-extrabold text-xs">
                    {leader.trophies} 🏆
                  </div>
                  <div className="absolute bottom-3 inset-x-3">
                    <div className="text-[11px] font-bold text-[#F5D061]">{leader.tenure}</div>
                    <h4 className="text-lg font-extrabold text-white">{leader.name}</h4>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-xs font-bold text-[#F5D061]">{leader.role[lang]}</div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {leader.legacy[lang]}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1 space-y-2">
                {leader.winRatePct !== null && (
                  <div className="px-3 py-1.5 rounded-lg bg-[#060913] border border-white/10 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                    <span>{lang === 'vi' ? 'Tỷ lệ thắng:' : 'Win Rate:'}</span>
                    <strong>{leader.winRatePct}%</strong>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLeader(leader);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#060913] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow whitespace-nowrap"
                >
                  <span>{lang === 'vi' ? 'Xem Hồ Sơ' : 'View Profile'}</span>
                </button>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* 2-COLUMN MODAL FOR CLUB LEADERS RENDERED VIA PORTAL ON DOCUMENT.BODY */}
      {selectedLeader &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-modal-backdrop"
            onClick={() => setSelectedLeader(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="profile-modal-surface animate-modal-panel relative w-full max-w-4xl max-h-[92vh] rounded-3xl overflow-y-auto transition-colors duration-300"
            >
              {/* Top Header Bar */}
              <div className="sticky top-0 z-20 flex items-center justify-between px-6 pt-4 pb-3 border-b border-[#D4AF37]/30 bg-inherit">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#060913] font-extrabold text-xs uppercase tracking-wider whitespace-nowrap">
                    {lang === 'vi' ? 'HỒ SƠ CHỦ TỊCH & HLV' : 'PATRIARCH & MANAGER DOSSIER'}
                  </span>
                  <span className="hidden sm:inline-block text-xs font-extrabold profile-modal-gold whitespace-nowrap">
                    {selectedLeader.tenure}
                  </span>
                  {selectedLeader.id === 'jose-mourinho' && (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap">
                      {lang === 'vi' ? '🟢 HLV ĐƯƠNG NHIỆM 2026/27' : '🟢 HEAD COACH 2026/27'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedLeader(null)}
                  className="p-2 rounded-full bg-[#D4AF37]/15 hover:bg-rose-500/20 profile-modal-title transition-all"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Large Crisp Portrait */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="keep-dark-surface relative w-full max-w-[320px] h-[400px] rounded-2xl overflow-hidden border-2 border-[#D4AF37] bg-[#060913] shadow-xl">
                    <PlayerAvatar
                      src={selectedLeader.imageUrl}
                      name={selectedLeader.name}
                      position={selectedLeader.role[lang]}
                      priority
                      className="w-full h-full object-cover object-[center_top]"
                    />
                    {selectedLeader.id === 'jose-mourinho' && (
                      <div className="absolute top-3 left-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] px-2 py-0.5 rounded-md backdrop-blur-sm shadow">
                        {lang === 'vi' ? '🟢 HLV ĐƯƠNG NHIỆM 2026/27' : '🟢 HEAD COACH 2026/27'}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-[#D4AF37] text-[#060913] font-extrabold text-sm shadow">
                      {selectedLeader.trophies} 🏆
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#060913] via-[#060913]/90 to-transparent p-4 text-center">
                      <div className="text-lg font-black text-white">{selectedLeader.name}</div>
                      <div className="text-xs font-bold text-[#F5D061]">{selectedLeader.tenure}</div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Full Leader Profile & Legacy */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 profile-modal-gold text-xs font-extrabold uppercase">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{selectedLeader.role[lang]}</span>
                  </div>

                  <h3 className="text-3xl font-black profile-modal-title">{selectedLeader.name}</h3>

                  <div className="text-sm font-extrabold profile-modal-gold">
                    {lang === 'vi' ? 'Nhiệm kỳ:' : 'Tenure:'} {selectedLeader.tenure}
                  </div>

                  <div className="profile-modal-box rounded-2xl p-4">
                    <p className="text-sm sm:text-base profile-modal-body leading-relaxed font-medium">
                      {selectedLeader.legacy[lang]}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="profile-modal-box p-4 rounded-xl text-center">
                      <div className="text-xs uppercase profile-modal-muted font-bold">
                        {lang === 'vi' ? 'Tổng Danh Hiệu' : 'Total Trophies'}
                      </div>
                      <div className="text-2xl font-extrabold profile-modal-gold mt-1">
                        {selectedLeader.trophies} 🏆
                      </div>
                    </div>
                    <div className="profile-modal-box p-4 rounded-xl text-center">
                      <div className="text-xs uppercase profile-modal-muted font-bold">
                        {lang === 'vi' ? 'Tỷ Lệ Chiến Thắng' : 'Career Win Rate'}
                      </div>
                      <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {selectedLeader.winRatePct !== null
                          ? `${selectedLeader.winRatePct}%`
                          : lang === 'vi'
                          ? 'Chủ tịch Đế chế'
                          : 'Patriarch President'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* HALA MADRID Y NADA MÁS INTERACTIVE ANTHEM */}
      <div className="glass-gold rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37] text-[#060913] flex items-center justify-center shadow">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">
                ¡HALA MADRID ...Y NADA MÁS!
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'vi'
                  ? 'Bài ca La Décima (Sáng tác: RedOne & Manuel Jabois, 2014) — Bản dịch song ngữ'
                  : 'Official La Décima Anthem (RedOne & Manuel Jabois, 2014) — Bilingual Lyrics'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {ANTHEM_STANZAS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStanza(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeStanza === idx
                    ? 'bg-[#D4AF37] text-[#060913]'
                    : 'bg-[#060913]/80 text-slate-300 border border-white/15'
                }`}
              >
                {lang === 'vi' ? `Đoạn ${idx + 1}` : `Verse ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>

        <div
          key={activeStanza}
          className="animate-section-reveal grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#060913]/85 rounded-2xl p-6 border border-[#D4AF37]/40"
        >
          <div>
            <div className="text-xs uppercase text-[#F5D061] font-bold mb-2">
              Español (Original Bernabéu Chant)
            </div>
            <pre className="text-lg sm:text-xl text-white whitespace-pre-wrap leading-relaxed italic">
              {ANTHEM_STANZAS[activeStanza].es}
            </pre>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="text-xs uppercase text-sky-500 font-bold mb-2">
              {lang === 'vi' ? 'Lời Dịch Tiếng Việt Hào Hùng' : 'English Translation'}
            </div>
            <pre className="text-base sm:text-lg text-slate-200 whitespace-pre-wrap leading-relaxed">
              {ANTHEM_STANZAS[activeStanza][lang]}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
