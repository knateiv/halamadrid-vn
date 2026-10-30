import { BilingualText } from '../types/database';

export interface TacticalHeatZone {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  tone: 'crimson' | 'gold' | 'cyan';
  label: BilingualText;
}

export interface WeightedPassLink {
  fromIdx: number;
  toIdx: number;
  weight: 1 | 2 | 3; // 1 = normal, 2 = frequent, 3 = primary tactical artery
}

export interface GoalAssistVector {
  id: string;
  fromIdx?: number;
  fromX: number;
  fromY: number;
  toIdx: number;
  toX: number;
  toY: number;
  ctrlX: number;
  ctrlY: number;
  label: BilingualText;
}

export interface TacticalRunVector {
  playerIdx: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface FinalTacticalBlueprint {
  edition: number;
  year: number;
  formation: string;
  defaultSpotlightIdx: number;
  heatZones: TacticalHeatZone[];
  passLinks: WeightedPassLink[];
  goalVectors: GoalAssistVector[];
  tacticalRuns: TacticalRunVector[];
  playerRoles: Record<
    number,
    {
      roleTitle: BilingualText;
      duty: BilingualText;
    }
  >;
  breakdown: {
    structure: BilingualText;
    overload: BilingualText;
    finisher: BilingualText;
  };
}

export const UCL_FINAL_TACTICS: Record<number, FinalTacticalBlueprint> = {
  // #1 - 1956: Real Madrid 4-3 Stade de Reims
  1: {
    edition: 1,
    year: 1956,
    formation: '3-2-5 (WM)',
    defaultSpotlightIdx: 8, // Di Stéfano #9
    heatZones: [
      {
        id: '1956-z1',
        cx: 50,
        cy: 42,
        rx: 24,
        ry: 15,
        tone: 'gold',
        label: {
          vi: 'Trục điều phối toàn sân (Di Stéfano #9 + Muñoz #4)',
          en: 'Total-Football Engine (Di Stéfano #9 + Muñoz #4)',
        },
      },
      {
        id: '1956-z2',
        cx: 18,
        cy: 26,
        rx: 15,
        ry: 14,
        tone: 'cyan',
        label: {
          vi: 'Hành lang bứt tốc cánh trái (Gento #11)',
          en: 'Supersonic Left Wing (Gento #11)',
        },
      },
      {
        id: '1956-z3',
        cx: 48,
        cy: 20,
        rx: 20,
        ry: 12,
        tone: 'crimson',
        label: {
          vi: 'Vùng xâm nhập ngược dòng 4–3 (Rial #10 & Marquitos #5)',
          en: '4–3 Remontada Box Zone (Rial #10 & Marquitos #5)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 0, toIdx: 2, weight: 2 },
      { fromIdx: 2, toIdx: 4, weight: 3 },
      { fromIdx: 2, toIdx: 5, weight: 2 },
      { fromIdx: 4, toIdx: 8, weight: 3 },
      { fromIdx: 5, toIdx: 9, weight: 3 },
      { fromIdx: 5, toIdx: 10, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 3 },
      { fromIdx: 8, toIdx: 6, weight: 2 },
      { fromIdx: 4, toIdx: 7, weight: 2 },
      { fromIdx: 10, toIdx: 9, weight: 2 },
    ],
    goalVectors: [
      {
        id: '1956-g1',
        fromIdx: 4,
        fromX: 64,
        fromY: 54,
        toIdx: 8,
        toX: 50,
        toY: 22,
        ctrlX: 62,
        ctrlY: 36,
        label: { vi: "Muñoz ➔ Di Stéfano [14']", en: "Muñoz ➔ Di Stéfano [14']" },
      },
      {
        id: '1956-g2',
        fromIdx: 10,
        fromX: 16,
        fromY: 28,
        toIdx: 9,
        toX: 36,
        toY: 32,
        ctrlX: 22,
        ctrlY: 18,
        label: { vi: "Gento ➔ Rial [79' (4–3)]", en: "Gento ➔ Rial [79' (4–3)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 8, fromX: 50, fromY: 22, toX: 50, toY: 42 },
      { playerIdx: 10, fromX: 16, fromY: 28, toX: 14, toY: 14 },
      { playerIdx: 2, fromX: 50, fromY: 74, toX: 50, toY: 28 },
    ],
    playerRoles: {
      8: {
        roleTitle: { vi: 'Số 9 Toàn Năng (Total Footballer)', en: 'Total-Football Center Forward' },
        duty: {
          vi: 'Lùi sâu về tận tuyến giữa nhận bóng từ Miguel Muñoz và rút ngắn tỷ số 1–2 ở phút 14, khởi đầu màn ngược dòng lịch sử.',
          en: 'Dropped deep into midfield to link play with Muñoz and scored the crucial 14th-minute goal to spark the comeback.',
        },
      },
      9: {
        roleTitle: { vi: 'Tiền Đạo Lệch Trái Sát Thủ', en: 'Inside-Left Match Winner' },
        duty: {
          vi: 'Lập cú đúp ở phút 30 và 79, trực tiếp ấn định chiến thắng 4–3 tại Parc des Princes.',
          en: 'Scored a decisive brace in the 30th and 79th minutes to seal the inaugural 4–3 European Cup triumph.',
        },
      },
      2: {
        roleTitle: { vi: 'Trung Vệ Dâng Cao Đột Biến', en: 'Box-Crashing Center Back' },
        duty: {
          vi: 'Bất ngờ băng lên xâm nhập vòng cấm gỡ hòa 3–3 ở phút 67 khiến hàng thủ Reims sụp đổ.',
          en: 'Surged forward from central defense to score the 67th-minute equalizer (3–3).',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Vận hành sơ đồ 3-2-5 (WM) cổ điển với cặp tiền vệ trụ Muñoz (#4) – Zárraga (#6) giữ nhịp sau lưng 5 mũi tấn công.',
        en: 'Operated a classic 3-2-5 WM structure anchored by pivot duo Muñoz (#4) and Zárraga (#6).',
      },
      overload: {
        vi: 'Di Stéfano (#9) lùi sâu tạo thế 3 đánh 2 ở trung tuyến, giải phóng khoảng trống cho Gento (#11) bứt tốc bên hành lang trái.',
        en: 'Di Stéfano (#9) dropped deep to create a 3v2 midfield overload, freeing Gento (#11) down the left channel.',
      },
      finisher: {
        vi: 'Bị dẫn 0–2 sau 10 phút đầu nhưng vùng lên thắng ngược 4–3 nhờ Di Stéfano (14\'), Marquitos (67\') và cú đúp của Héctor Rial (30\', 79\').',
        en: 'Erased an early 0–2 deficit to win 4–3 via Di Stéfano (14\'), Marquitos (67\'), and a Héctor Rial brace (30\', 79\').',
      },
    },
  },

  // #2 - 1957: Real Madrid 2-0 Fiorentina
  2: {
    edition: 2,
    year: 1957,
    formation: '3-2-5 (WM)',
    defaultSpotlightIdx: 10, // Gento #11
    heatZones: [
      {
        id: '1957-z1',
        cx: 82,
        cy: 30,
        rx: 16,
        ry: 14,
        tone: 'gold',
        label: {
          vi: 'Hành lang kỹ thuật kéo giãn Catenaccio (Kopa #7)',
          en: 'Right-Flank Catenaccio Breaker (Kopa #7)',
        },
      },
      {
        id: '1957-z2',
        cx: 50,
        cy: 22,
        rx: 18,
        ry: 11,
        tone: 'crimson',
        label: {
          vi: 'Vùng gây sức ép buộc phạm lỗi 11m (Mateos #8 & Di Stéfano #9)',
          en: 'Penalty-Box Pressure Zone (Mateos #8 & Di Stéfano #9)',
        },
      },
      {
        id: '1957-z3',
        cx: 20,
        cy: 24,
        rx: 16,
        ry: 13,
        tone: 'cyan',
        label: {
          vi: 'Tuyến phản công tốc độ kết liễu (Gento #11)',
          en: 'Counter-Attack Finishing Lane (Gento #11)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 4, toIdx: 6, weight: 3 },
      { fromIdx: 5, toIdx: 10, weight: 3 },
      { fromIdx: 6, toIdx: 8, weight: 3 },
      { fromIdx: 8, toIdx: 7, weight: 2 },
      { fromIdx: 8, toIdx: 9, weight: 3 },
      { fromIdx: 9, toIdx: 10, weight: 3 },
      { fromIdx: 2, toIdx: 4, weight: 2 },
      { fromIdx: 2, toIdx: 5, weight: 2 },
    ],
    goalVectors: [
      {
        id: '1957-g1',
        fromIdx: 7,
        fromX: 64,
        fromY: 32,
        toIdx: 8,
        toX: 50,
        toY: 22,
        ctrlX: 60,
        ctrlY: 20,
        label: { vi: "Di Stéfano [69' Pen (1–0)]", en: "Di Stéfano [69' Pen (1–0)]" },
      },
      {
        id: '1957-g2',
        fromIdx: 9,
        fromX: 36,
        fromY: 32,
        toIdx: 10,
        toX: 16,
        toY: 28,
        ctrlX: 25,
        ctrlY: 18,
        label: { vi: "Rial ➔ Gento [75' (2–0)]", en: "Rial ➔ Gento [75' (2–0)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 10, fromX: 16, fromY: 28, toX: 32, toY: 14 },
      { playerIdx: 6, fromX: 84, fromY: 28, toX: 68, toY: 20 },
    ],
    playerRoles: {
      10: {
        roleTitle: { vi: 'Cơn Lốc Đường Biên ("La Galerna")', en: '"The Cantabrian Gale" Left Winger' },
        duty: {
          vi: 'Bứt tốc xé toạc bẫy việt vị dâng cao của Fiorentina ở phút 75 để lốp bóng qua đầu thủ môn Sarti ấn định tỷ số 2–0.',
          en: 'Shattered Fiorentina’s high line in the 75th minute to chip goalkeeper Sarti for the 2–0 clincher.',
        },
      },
      6: {
        roleTitle: { vi: 'Nhạc Trưởng Cánh Phải ("Napoléon")', en: 'Right-Wing Playmaker' },
        duty: {
          vi: 'Quấy rối liên tục hành lang phải bằng kỹ thuật rê dắt siêu việt, kéo giãn khối bê tông phòng ngự Ý.',
          en: 'Stretched the Italian low block with relentless dribbling and diagonal playmaking from the right wing.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Trận chung kết duy nhất tại thánh địa Santiago Bernabéu (124.000 khán giả), bổ sung Raymond Kopa (#7) vào bộ ngũ tấn công.',
        en: 'Played before 124,000 fans at the Santiago Bernabéu with Raymond Kopa (#7) added to the five-man frontline.',
      },
      overload: {
        vi: 'Kopa (#7) và Rial (#10) liên tục đổi vị trí ở hai nách trung lộ để phá vỡ khối phòng ngự lùi sâu của Fiorentina.',
        en: 'Kopa (#7) and Rial (#10) overloaded the half-spaces to unlock Fiorentina’s disciplined Italian defense.',
      },
      finisher: {
        vi: 'Di Stéfano mở tỷ số trên chấm 11m (69\') buộc Fiorentina dâng cao, tạo thời cơ cho Gento phản công ghi bàn 2–0 (75\').',
        en: 'Di Stéfano’s 69th-minute penalty forced Fiorentina forward, allowing Gento to seal it 2–0 on the counter (75\').',
      },
    },
  },

  // #3 - 1958: Real Madrid 3-2 AC Milan (a.e.t.)
  3: {
    edition: 3,
    year: 1958,
    formation: '3-2-5 (Santamaría Stopper)',
    defaultSpotlightIdx: 10, // Gento #11
    heatZones: [
      {
        id: '1958-z1',
        cx: 50,
        cy: 72,
        rx: 22,
        ry: 12,
        tone: 'cyan',
        label: {
          vi: 'Lá chắn thép phong tỏa Schiaffino (Santamaría #5)',
          en: 'Central Stopper Shield (Santamaría #5)',
        },
      },
      {
        id: '1958-z2',
        cx: 46,
        cy: 24,
        rx: 22,
        ry: 13,
        tone: 'crimson',
        label: {
          vi: 'Khu vực gỡ hòa 2 lần liên tiếp (Di Stéfano #9 & Rial #10)',
          en: 'Double-Equalizer Strike Zone (Di Stéfano #9 & Rial #10)',
        },
      },
      {
        id: '1958-z3',
        cx: 20,
        cy: 22,
        rx: 16,
        ry: 13,
        tone: 'gold',
        label: {
          vi: 'Đòn kết liễu hiệp phụ phút 107 (Gento #11)',
          en: '107\' Extra-Time Winner Zone (Gento #11)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 2, toIdx: 4, weight: 3 },
      { fromIdx: 2, toIdx: 5, weight: 3 },
      { fromIdx: 4, toIdx: 6, weight: 3 },
      { fromIdx: 6, toIdx: 8, weight: 3 },
      { fromIdx: 7, toIdx: 9, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 3 },
      { fromIdx: 5, toIdx: 10, weight: 3 },
    ],
    goalVectors: [
      {
        id: '1958-g1',
        fromIdx: 7,
        fromX: 64,
        fromY: 32,
        toIdx: 9,
        toX: 36,
        toY: 32,
        ctrlX: 50,
        ctrlY: 16,
        label: { vi: "Joseíto ➔ Rial [79' (2–2)]", en: "Joseíto ➔ Rial [79' (2–2)]" },
      },
      {
        id: '1958-g2',
        fromIdx: 5,
        fromX: 36,
        fromY: 54,
        toIdx: 10,
        toX: 16,
        toY: 28,
        ctrlX: 18,
        ctrlY: 42,
        label: { vi: "Gento [107' Hiệp phụ (3–2)]", en: "Gento [107' ET Winner (3–2)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 10, fromX: 16, fromY: 28, toX: 28, toY: 15 },
      { playerIdx: 8, fromX: 50, fromY: 22, toX: 38, toY: 14 },
    ],
    playerRoles: {
      10: {
        roleTitle: { vi: 'Người Hùng Hiệp Phụ (107\')', en: 'Extra-Time Hero (107\')' },
        duty: {
          vi: 'Ghi bàn thắng vàng ở phút 107 trong hiệp phụ tại Heysel để khuất phục AC Milan 3–2.',
          en: 'Struck the decisive 107th-minute winner in extra time to defeat AC Milan 3–2 in Brussels.',
        },
      },
      2: {
        roleTitle: { vi: 'Hòn Đá Tảng Trung Tâm ("El Muro")', en: 'Commanding Central Stopper' },
        duty: {
          vi: 'Gia cố trục dọc hàng thủ trước sức ép dữ dội từ Schiaffino và Liedholm của AC Milan.',
          en: 'Anchored the defensive line during extra time against Milan’s South American-Nordic attack.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Sự xuất hiện của trung vệ thép José Santamaría (#5) giúp khối 3-2-5 đứng vững trước hàng công siêu hạng của AC Milan.',
        en: 'The addition of stopper José Santamaría (#5) stabilized the back three against AC Milan.',
      },
      overload: {
        vi: 'Bộ tứ Kopa (#7) – Joseíto (#8) – Di Stéfano (#9) – Rial (#10) ban bật ngắn tốc độ cao ngay trước vòng cấm Milan.',
        en: 'Kopa, Joseíto, Di Stéfano, and Rial executed rapid one-touch combinations at the edge of Milan’s box.',
      },
      finisher: {
        vi: 'Hai lần bị dẫn bàn nhưng gỡ hòa nhờ Di Stéfano (74\') và Rial (79\'), trước khi Gento ghi bàn quyết định ở phút 107.',
        en: 'Equalized twice via Di Stéfano (74\') and Rial (79\') before Gento netted the 107th-minute winner.',
      },
    },
  },

  // #4 - 1959: Real Madrid 2-0 Stade de Reims
  4: {
    edition: 4,
    year: 1959,
    formation: '3-2-5 (Asymmetric)',
    defaultSpotlightIdx: 8, // Di Stéfano #9
    heatZones: [
      {
        id: '1959-z1',
        cx: 62,
        cy: 28,
        rx: 18,
        ry: 13,
        tone: 'gold',
        label: {
          vi: 'Mũi khoan đánh phủ đầu phút thứ 1 (Mateos #8)',
          en: '1st-Minute Blitz Zone (Mateos #8)',
        },
      },
      {
        id: '1959-z2',
        cx: 50,
        cy: 24,
        rx: 20,
        ry: 12,
        tone: 'crimson',
        label: {
          vi: 'Trục sút xa kết liễu đầu hiệp 2 (Di Stéfano #9)',
          en: 'Long-Range Clincher Zone (Di Stéfano #9)',
        },
      },
      {
        id: '1959-z3',
        cx: 50,
        cy: 72,
        rx: 26,
        ry: 13,
        tone: 'cyan',
        label: {
          vi: 'Khối phòng ngự giữ sạch lưới trước Just Fontaine',
          en: 'Clean-Sheet Wall vs Just Fontaine',
        },
      },
    ],
    passLinks: [
      { fromIdx: 2, toIdx: 4, weight: 3 },
      { fromIdx: 2, toIdx: 5, weight: 3 },
      { fromIdx: 4, toIdx: 7, weight: 3 },
      { fromIdx: 5, toIdx: 9, weight: 3 },
      { fromIdx: 9, toIdx: 7, weight: 3 },
      { fromIdx: 8, toIdx: 10, weight: 2 },
      { fromIdx: 6, toIdx: 8, weight: 2 },
    ],
    goalVectors: [
      {
        id: '1959-g1',
        fromIdx: 9,
        fromX: 36,
        fromY: 32,
        toIdx: 7,
        toX: 64,
        toY: 32,
        ctrlX: 50,
        ctrlY: 16,
        label: { vi: "Rial ➔ Mateos [1' (1–0)]", en: "Rial ➔ Mateos [1' (1–0)]" },
      },
      {
        id: '1959-g2',
        fromIdx: 4,
        fromX: 64,
        fromY: 54,
        toIdx: 8,
        toX: 50,
        toY: 22,
        ctrlX: 58,
        ctrlY: 36,
        label: { vi: "Di Stéfano [47' (2–0)]", en: "Di Stéfano [47' (2–0)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 7, fromX: 64, fromY: 32, toX: 58, toY: 16 },
      { playerIdx: 10, fromX: 16, fromY: 28, toX: 16, toY: 14 },
    ],
    playerRoles: {
      8: {
        roleTitle: { vi: 'Thủ Lĩnh Tối Cao ("La Saeta Rubia")', en: '"The Blonde Arrow" Leader' },
        duty: {
          vi: 'Khi Kopa bị đau phải dạt biên, Di Stéfano vừa lùi về gánh tuyến giữa vừa tự mình sút xa nâng tỷ số lên 2–0 ở phút 47.',
          en: 'With Kopa injured on the wing, Di Stéfano ran the midfield and fired home the 47th-minute clincher.',
        },
      },
      2: {
        roleTitle: { vi: 'Chốt Chặn Phong Tỏa Vua Phá Lưới World Cup', en: 'Fontaine Neutralizer' },
        duty: {
          vi: 'Bắt chết chân sút huyền thoại Just Fontaine (13 bàn World Cup 1958), giúp Real Madrid giữ sạch lưới 2–0.',
          en: 'Completely neutralized World Cup record-holder Just Fontaine to preserve a 2–0 clean sheet.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Bất chấp Puskás vắng mặt và Kopa chấn thương ngay đầu trận, Real Madrid vẫn duy trì cự ly đội hình cực kỳ kỷ luật tại Stuttgart.',
        en: 'Despite Puskás missing out and an early injury to Kopa, Madrid maintained supreme tactical discipline in Stuttgart.',
      },
      overload: {
        vi: 'Santamaría (#5) và Marquitos (#2) khóa chặt trung lộ của Just Fontaine, buộc Reims phải sút xa vô hại.',
        en: 'Santamaría (#5) and Marquitos (#2) locked down central zones against Just Fontaine.',
      },
      finisher: {
        vi: 'Enrique Mateos ghi bàn ngay giây thứ 50 (1\') và Di Stéfano đóng đinh trận đấu ngay đầu hiệp hai (47\').',
        en: 'Enrique Mateos scored in the 1st minute and Di Stéfano sealed the 2–0 victory in the 47th minute.',
      },
    },
  },

  // #5 - 1960: Real Madrid 7-3 Eintracht Frankfurt
  5: {
    edition: 5,
    year: 1960,
    formation: '3-2-5 (Di Stéfano × Puskás)',
    defaultSpotlightIdx: 9, // Puskás #10
    heatZones: [
      {
        id: '1960-z1',
        cx: 44,
        cy: 22,
        rx: 26,
        ry: 14,
        tone: 'crimson',
        label: {
          vi: 'Vùng hủy diệt 7 bàn lịch sử (Puskás 4 bàn + Di Stéfano 3 bàn)',
          en: '7-Goal Destruction Zone (Puskás 4G + Di Stéfano 3G)',
        },
      },
      {
        id: '1960-z2',
        cx: 60,
        cy: 44,
        rx: 22,
        ry: 13,
        tone: 'gold',
        label: {
          vi: 'Trục luân chuyển siêu thanh (Del Sol #8 + Vidal #4 + Zárraga #6)',
          en: 'High-Tempo Midfield Engine (Del Sol #8 + Vidal #4)',
        },
      },
      {
        id: '1960-z3',
        cx: 18,
        cy: 26,
        rx: 15,
        ry: 14,
        tone: 'cyan',
        label: {
          vi: 'Hành lang căng ngang tốc độ (Gento #11)',
          en: 'Cutback Supply Corridor (Gento #11)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 4, toIdx: 7, weight: 3 },
      { fromIdx: 5, toIdx: 9, weight: 3 },
      { fromIdx: 7, toIdx: 8, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 3 },
      { fromIdx: 10, toIdx: 8, weight: 3 },
      { fromIdx: 10, toIdx: 9, weight: 3 },
      { fromIdx: 6, toIdx: 8, weight: 2 },
      { fromIdx: 2, toIdx: 5, weight: 2 },
    ],
    goalVectors: [
      {
        id: '1960-g1',
        fromIdx: 6,
        fromX: 84,
        fromY: 28,
        toIdx: 8,
        toX: 50,
        toY: 22,
        ctrlX: 68,
        ctrlY: 16,
        label: { vi: "Di Stéfano Hat-trick [27', 30', 73']", en: "Di Stéfano Hat-trick [27', 30', 73']" },
      },
      {
        id: '1960-g2',
        fromIdx: 10,
        fromX: 16,
        fromY: 28,
        toIdx: 9,
        toX: 36,
        toY: 26,
        ctrlX: 24,
        ctrlY: 14,
        label: { vi: "Puskás Poker 4 Bàn [46', 56', 60', 71']", en: "Puskás 4-Goal Poker [46', 56', 60', 71']" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 9, fromX: 36, fromY: 26, toX: 40, toY: 14 },
      { playerIdx: 8, fromX: 50, fromY: 22, toX: 52, toY: 12 },
      { playerIdx: 10, fromX: 16, fromY: 28, toX: 16, toY: 14 },
    ],
    playerRoles: {
      9: {
        roleTitle: { vi: 'Kỷ Lục Gia Poker Chung Kết C1 (4 Bàn)', en: '4-Goal Final Record Holder' },
        duty: {
          vi: 'Ghi một mạch 4 bàn thắng liên tiếp (46\', 56\', 60\', 71\') bằng những cú đại bác chân trái không thể cản phá tại Hampden Park.',
          en: 'Unleashed a historic 4-goal haul (46\', 56\', 60\', 71\') with thunderous left-footed strikes at Hampden Park.',
        },
      },
      8: {
        roleTitle: { vi: 'Nhạc Trưởng Toàn Sân (Hat-trick 3 Bàn)', en: 'Total-Football Hat-Trick Maestro' },
        duty: {
          vi: 'Lập hat-trick (27\', 30\', 73\') và điều khiển toàn bộ nhịp độ trận chung kết vĩ đại nhất lịch sử bóng đá thế giới (7–3).',
          en: 'Scored a hat-trick (27\', 30\', 73\') while orchestrating every phase of play before 127,621 spectators.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Đỉnh cao nghệ thuật bóng đá tấn công 3-2-5 trước 127.621 khán giả tại Hampden Park (Glasgow) dưới thời HLV Miguel Muñoz.',
        en: 'The pinnacle of attacking football before 127,621 fans at Hampden Park under coach Miguel Muñoz.',
      },
      overload: {
        vi: 'Del Sol (#8) cùng Di Stéfano (#9) liên tục hoán đổi vị trí, tạo khoảng trống mênh mông ở nách trái cho cái chân trái của Puskás (#10).',
        en: 'Del Sol (#8) and Di Stéfano (#9) rotated fluidly, isolating Puskás (#10) in the left inside channel.',
      },
      finisher: {
        vi: 'Cặp song sát Di Stéfano (3 bàn) và Puskás (4 bàn) ghi trọn vẹn cả 7 bàn thắng, hoàn tất kỷ lục 5 Cúp C1 liên tiếp (La Quinta).',
        en: 'Di Stéfano (3 goals) and Puskás (4 goals) scored all 7 goals to complete the historic 5-Peat (La Quinta).',
      },
    },
  },

  // #6 - 1966: Real Madrid 2-1 Partizan Belgrade
  6: {
    edition: 6,
    year: 1966,
    formation: '4-2-4 (Yé-Yé Generation)',
    defaultSpotlightIdx: 8, // Amancio #8
    heatZones: [
      {
        id: '1966-z1',
        cx: 50,
        cy: 52,
        rx: 24,
        ry: 13,
        tone: 'cyan',
        label: {
          vi: 'Trục càn quét & kiến thiết (Pirri #4 + Velázquez #10)',
          en: 'Box-to-Box & Playmaking Pivot (Pirri #4 + Velázquez #10)',
        },
      },
      {
        id: '1966-z2',
        cx: 60,
        cy: 24,
        rx: 18,
        ry: 13,
        tone: 'gold',
        label: {
          vi: 'Vùng đột phá qua người gỡ hòa (Amancio #8)',
          en: 'Solo Dribble Equalizer Zone (Amancio #8)',
        },
      },
      {
        id: '1966-z3',
        cx: 76,
        cy: 30,
        rx: 16,
        ry: 12,
        tone: 'crimson',
        label: {
          vi: 'Vùng vô-lê sấm sét từ cự ly 25m (Serena #7)',
          en: '25-Meter Volley Winner Zone (Serena #7)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 2, toIdx: 5, weight: 2 },
      { fromIdx: 3, toIdx: 6, weight: 3 },
      { fromIdx: 5, toIdx: 8, weight: 3 },
      { fromIdx: 6, toIdx: 8, weight: 3 },
      { fromIdx: 6, toIdx: 10, weight: 3 },
      { fromIdx: 5, toIdx: 7, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 2 },
    ],
    goalVectors: [
      {
        id: '1966-g1',
        fromIdx: 6,
        fromX: 38,
        fromY: 52,
        toIdx: 8,
        toX: 60,
        toY: 26,
        ctrlX: 48,
        ctrlY: 36,
        label: { vi: "Velázquez ➔ Amancio [70' (1–1)]", en: "Velázquez ➔ Amancio [70' (1–1)]" },
      },
      {
        id: '1966-g2',
        fromIdx: 5,
        fromX: 62,
        fromY: 52,
        toIdx: 7,
        toX: 84,
        toY: 28,
        ctrlX: 76,
        ctrlY: 38,
        label: { vi: "Serena [76' Vô-lê 25m (2–1)]", en: "Serena [76' 25m Volley (2–1)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 8, fromX: 60, fromY: 26, toX: 52, toY: 16 },
      { playerIdx: 10, fromX: 16, fromY: 28, toX: 16, toY: 14 },
    ],
    playerRoles: {
      8: {
        roleTitle: { vi: 'Phù Thủy Rê Dắt ("El Brujo")', en: '"El Brujo" Inside Forward' },
        duty: {
          vi: 'Nhận đường chọc khe của Velázquez ở phút 70, ngoặt bóng loại bỏ hậu vệ Partizan rồi dứt điểm lạnh lùng gỡ hòa 1–1.',
          en: 'Collected Velázquez’s through-ball in the 70th minute, feinted past his marker, and slotted home the 1–1 equalizer.',
        },
      },
      10: {
        roleTitle: { vi: 'Đội Trưởng Kỷ Lục 6 Cúp C1', en: '6-Time European Cup Captain' },
        duty: {
          vi: 'Thủ lĩnh tinh thần của thế hệ Yé-Yé (100% cầu thủ Tây Ban Nha), nâng cao chiếc Cúp C1 thứ 6 trong sự nghiệp.',
          en: 'Captained the all-Spanish Yé-Yé side to become the first player in history to win 6 European Cups.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Chuyển dịch sang sơ đồ 4-2-4 hiện đại với 11 cầu thủ 100% người Tây Ban Nha (Thế hệ Yé-Yé) do lão tướng Paco Gento (#11) dẫn dắt.',
        en: 'Transitioned to a modern 4-2-4 with an all-Spanish "Yé-Yé" XI captained by 6-time winner Paco Gento (#11).',
      },
      overload: {
        vi: 'Cặp tiền vệ trung tâm Pirri (#4) – Velázquez (#10) áp đảo tuyến giữa trong hiệp 2 sau khi bị Partizan mở tỷ số phút 55.',
        en: 'Midfield pair Pirri (#4) and Velázquez (#10) took total control after Partizan’s 55th-minute opener.',
      },
      finisher: {
        vi: 'Chỉ trong 6 phút (70\'–76\'), pha solo của Amancio và cú vô-lê trái phá từ 25m của Fernando Serena hoàn tất màn lội ngược dòng 2–1.',
        en: 'Two goals in 6 minutes—Amancio’s solo effort (70\') and Serena’s 25m volley (76\')—sealed the 2–1 comeback.',
      },
    },
  },

  // #7 - 1998: Real Madrid 1-0 Juventus
  7: {
    edition: 7,
    year: 1998,
    formation: '4-3-1-2 (Narrow Diamond)',
    defaultSpotlightIdx: 5, // Redondo #6
    heatZones: [
      {
        id: '1998-z1',
        cx: 50,
        cy: 56,
        rx: 24,
        ry: 14,
        tone: 'gold',
        label: {
          vi: 'Vùng phong tỏa Zidane & Davids (Redondo #6 + Hierro #4)',
          en: 'Zidane & Davids Lockdown Zone (Redondo #6 + Hierro #4)',
        },
      },
      {
        id: '1998-z2',
        cx: 18,
        cy: 46,
        rx: 15,
        ry: 18,
        tone: 'cyan',
        label: {
          vi: 'Hành lang dâng cao tạt bóng (Roberto Carlos #3)',
          en: 'Left Wing-Back Overlap (Roberto Carlos #3)',
        },
      },
      {
        id: '1998-z3',
        cx: 40,
        cy: 18,
        rx: 18,
        ry: 11,
        tone: 'crimson',
        label: {
          vi: 'Điểm chớp thời cơ kết liễu phút 66 (Mijatović #8)',
          en: '66\' Clinical Poaching Zone (Mijatović #8)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 2, toIdx: 5, weight: 3 },
      { fromIdx: 3, toIdx: 5, weight: 3 },
      { fromIdx: 5, toIdx: 6, weight: 3 },
      { fromIdx: 5, toIdx: 7, weight: 3 },
      { fromIdx: 5, toIdx: 8, weight: 3 },
      { fromIdx: 4, toIdx: 7, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 2 },
      { fromIdx: 8, toIdx: 10, weight: 3 },
    ],
    goalVectors: [
      {
        id: '1998-g1',
        fromIdx: 4,
        fromX: 18,
        fromY: 70,
        toIdx: 10,
        toX: 36,
        toY: 20,
        ctrlX: 16,
        ctrlY: 36,
        label: { vi: "R. Carlos ➔ Mijatović [66' (1–0)]", en: "R. Carlos ➔ Mijatović [66' (1–0)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 4, fromX: 18, fromY: 70, toX: 16, toY: 32 },
      { playerIdx: 10, fromX: 36, fromY: 20, toX: 44, toY: 12 },
    ],
    playerRoles: {
      5: {
        roleTitle: { vi: 'Hoàng Tử Mỏ Neo ("El Príncipe")', en: '"El Príncipe" Deep-Lying Regista' },
        duty: {
          vi: 'Làm chủ hoàn toàn khu trung tuyến trước Edgar Davids & Deschamps, điều tiết nhịp độ bằng cái chân trái thanh thoát.',
          en: 'Outclassed Juventus’s midfield of Davids and Deschamps, dictating tempo from the base of the diamond.',
        },
      },
      10: {
        roleTitle: { vi: 'Người Hùng La Séptima (Sau 32 Năm)', en: 'Hero of La Séptima' },
        duty: {
          vi: 'Đón cú sút bóng bật ra của Roberto Carlos ở phút 66, lách qua thủ môn Peruzzi ghi bàn thắng vàng chấm dứt 32 năm chờ đợi.',
          en: 'Reacted instantly to Roberto Carlos’s deflected shot in the 66th minute, rounding Peruzzi to end a 32-year wait.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'HLV Jupp Heynckes bố trí sơ đồ 4-3-1-2 thu hẹp cự ly trung tuyến để khắc chế Juventus của Zinedine Zidane và Inzaghi.',
        en: 'Jupp Heynckes deployed a compact 4-3-1-2 diamond to suffocate Juventus’s central playmaker Zinedine Zidane.',
      },
      overload: {
        vi: 'Redondo (#6) đá trụ đơn cùng Seedorf (#10) – Karembeu (#19) bóp nghẹt không gian, trong khi Roberto Carlos (#3) làm chủ biên trái.',
        en: 'Redondo (#6), Seedorf (#10), and Karembeu (#19) dominated the middle while Roberto Carlos (#3) bombed down the left.',
      },
      finisher: {
        vi: 'Phút 66, từ pha tạt của Panucci và cú sút chéo góc của Roberto Carlos, Predrag Mijatović (#8) vượt qua Peruzzi ấn định tỷ số 1–0.',
        en: 'In the 66th minute, Roberto Carlos’s fierce drive fell to Predrag Mijatović (#8), who rounded Peruzzi to score the 1–0 winner.',
      },
    },
  },

  // #8 - 2000: Real Madrid 3-0 Valencia
  8: {
    edition: 8,
    year: 2000,
    formation: '5-3-2 / 3-4-1-2 Wing-Backs',
    defaultSpotlightIdx: 8, // Raúl #7
    heatZones: [
      {
        id: '2000-z1',
        cx: 50,
        cy: 74,
        rx: 24,
        ry: 12,
        tone: 'cyan',
        label: {
          vi: 'Khối 3 trung vệ libero (Helguera #15 + Campo #12 + Karanka #18)',
          en: '3-CB Sweeper Block (Helguera #15 + Campo #12 + Karanka #18)',
        },
      },
      {
        id: '2000-z2',
        cx: 68,
        cy: 46,
        rx: 18,
        ry: 15,
        tone: 'gold',
        label: {
          vi: 'Vùng vô-lê cắt kéo & kéo bóng (McManaman #8 + Salgado #2)',
          en: 'Scissor-Volley & Transition Zone (McManaman #8 + Salgado #2)',
        },
      },
      {
        id: '2000-z3',
        cx: 52,
        cy: 20,
        rx: 22,
        ry: 12,
        tone: 'crimson',
        label: {
          vi: 'Vùng không chiến & bứt tốc solo 70m (Morientes #9 & Raúl #7)',
          en: 'Aerial & 70m Solo Breakaway Zone (Morientes #9 & Raúl #7)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 3, toIdx: 6, weight: 3 },
      { fromIdx: 3, toIdx: 7, weight: 3 },
      { fromIdx: 1, toIdx: 6, weight: 3 },
      { fromIdx: 5, toIdx: 7, weight: 3 },
      { fromIdx: 6, toIdx: 9, weight: 3 },
      { fromIdx: 7, toIdx: 8, weight: 3 },
      { fromIdx: 8, toIdx: 10, weight: 2 },
    ],
    goalVectors: [
      {
        id: '2000-g1',
        fromIdx: 1,
        fromX: 84,
        fromY: 68,
        toIdx: 9,
        toX: 64,
        toY: 18,
        ctrlX: 82,
        ctrlY: 36,
        label: { vi: "Salgado ➔ Morientes [39' Đánh đầu]", en: "Salgado ➔ Morientes [39' Header]" },
      },
      {
        id: '2000-g2',
        fromIdx: 8,
        fromX: 50,
        fromY: 32,
        toIdx: 8,
        toX: 50,
        toY: 14,
        ctrlX: 38,
        ctrlY: 20,
        label: { vi: "Raúl [75' Solo 70m (3–0)]", en: "Raúl [75' 70m Solo (3–0)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 1, fromX: 84, fromY: 68, toX: 84, toY: 28 },
      { playerIdx: 5, fromX: 16, fromY: 68, toX: 16, toY: 28 },
      { playerIdx: 8, fromX: 50, fromY: 32, toX: 50, toY: 12 },
    ],
    playerRoles: {
      8: {
        roleTitle: { vi: 'Chúa Nhẫn ("El Siete") — Solo 70m', en: 'Raúl #7 — 70m Solo Clincher' },
        duty: {
          vi: 'Bứt tốc một mạch 70 mét từ phần sân nhà ở phút 75, lừa bóng qua thủ thành Cañizares để ấn định chiến thắng 3–0 tại Paris.',
          en: 'Sprinted 70 meters on a solo counterattack in the 75th minute, rounding Cañizares to seal the 3–0 triumph.',
        },
      },
      6: {
        roleTitle: { vi: 'Tiền Vệ Con Thoi Xuất Sắc Nhất Trận', en: 'Man of the Match Box-to-Box' },
        duty: {
          vi: 'Tung cú vô-lê cắt kéo tuyệt đẹp ở rìa vòng cấm phút 67 nâng tỷ số lên 2–0 và làm tê liệt tuyến giữa của Valencia.',
          en: 'Scored a sensational 67th-minute scissor volley and relentlessly pressed Valencia’s midfield.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'HLV Vicente del Bosque gây bất ngờ với sơ đồ 5-3-2 (Helguera #15 đá libero giữa Karanka và Iván Campo), giải phóng 2 hậu vệ biên.',
        en: 'Vicente del Bosque deployed a 3-CB/5-3-2 system with Helguera (#15) as sweeper, unleashing wing-backs Salgado and Roberto Carlos.',
      },
      overload: {
        vi: 'Salgado (#2) và Roberto Carlos (#3) dâng cao như hai tiền đạo cánh, kéo giãn hoàn toàn khối 4-4-2 của Valencia.',
        en: 'Salgado (#2) and Roberto Carlos (#3) pinned Valencia’s full-backs deep, creating space for Redondo (#6) and McManaman (#8).',
      },
      finisher: {
        vi: 'Morientes đánh đầu mở tỷ số (39\'), McManaman vô-lê nhân đôi cách biệt (67\') và Raúl solo 70m ấn định thắng lợi 3–0 (75\').',
        en: 'Morientes’s header (39\'), McManaman’s scissor volley (67\'), and Raúl’s 70m solo goal (75\') delivered a 3–0 masterclass.',
      },
    },
  },

  // #9 - 2002: Real Madrid 2-1 Bayer Leverkusen
  9: {
    edition: 9,
    year: 2002,
    formation: '4-4-2 Asymmetric (Zidane Free Left)',
    defaultSpotlightIdx: 8, // Zidane #5
    heatZones: [
      {
        id: '2002-z1',
        cx: 18,
        cy: 46,
        rx: 15,
        ry: 22,
        tone: 'cyan',
        label: {
          vi: 'Hành lang ném biên & chồng biên trái (R. Carlos #3 + Solari #21)',
          en: 'Left-Flank Overlap & Throw-In Lane (R. Carlos #3 + Solari #21)',
        },
      },
      {
        id: '2002-z2',
        cx: 48,
        cy: 34,
        rx: 20,
        ry: 13,
        tone: 'crimson',
        label: {
          vi: 'Tọa độ siêu phẩm vô-lê chân trái (Zinedine Zidane #5)',
          en: 'Iconic Left-Footed Volley Zone (Zinedine Zidane #5)',
        },
      },
      {
        id: '2002-z3',
        cx: 50,
        cy: 86,
        rx: 22,
        ry: 10,
        tone: 'gold',
        label: {
          vi: '3 pha cứu thua thần thánh cuối trận (Iker Casillas)',
          en: 'Miracle Late Saves Zone (Iker Casillas)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 5, toIdx: 8, weight: 3 },
      { fromIdx: 5, toIdx: 6, weight: 2 },
      { fromIdx: 4, toIdx: 7, weight: 3 },
      { fromIdx: 7, toIdx: 8, weight: 3 },
      { fromIdx: 4, toIdx: 8, weight: 3 },
      { fromIdx: 4, toIdx: 9, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 3 },
      { fromIdx: 8, toIdx: 10, weight: 2 },
    ],
    goalVectors: [
      {
        id: '2002-g1',
        fromIdx: 4,
        fromX: 18,
        fromY: 70,
        toIdx: 9,
        toX: 38,
        toY: 20,
        ctrlX: 14,
        ctrlY: 38,
        label: { vi: "R. Carlos Ném biên ➔ Raúl [8' (1–0)]", en: "R. Carlos Throw-in ➔ Raúl [8' (1–0)]" },
      },
      {
        id: '2002-g2',
        fromIdx: 4,
        fromX: 18,
        fromY: 70,
        toIdx: 8,
        toX: 50,
        toY: 36,
        ctrlX: 24,
        ctrlY: 26,
        label: { vi: "R. Carlos ➔ Zidane [45' Vô-lê thế kỷ (2–1)]", en: "R. Carlos ➔ Zidane [45' Century Volley]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 4, fromX: 18, fromY: 70, toX: 16, toY: 26 },
      { playerIdx: 8, fromX: 50, fromY: 36, toX: 46, toY: 24 },
    ],
    playerRoles: {
      8: {
        roleTitle: { vi: 'Nhạc Trưởng Thiên Tài — Tác Giả Bàn Thắng Thế Kỷ', en: 'Maestro of the Volley of the Century' },
        duty: {
          vi: 'Xoay trụ đón quả tạt bổng hình cầu vồng của Roberto Carlos ở phút 45, tung cú vô-lê chân trái không tưởng vào góc cao khung thành Butt.',
          en: 'Connected with Roberto Carlos’s looping cross in the 45th minute to score the greatest left-footed volley in Champions League history.',
        },
      },
      5: {
        roleTitle: { vi: 'Máy Quét Tuyến Giữa (The Makélélé Role)', en: 'Single Pivot Destroyer' },
        duty: {
          vi: 'Một mình bao quát toàn bộ khoảng trống trước cặp trung vệ Hierro – Helguera, khóa chặt ngòi nổ Michael Ballack.',
          en: 'Single-handedly shielded the back four and neutralized Michael Ballack’s runs from midfield.',
        },
      },
      0: {
        roleTitle: { vi: '"Thánh Iker" — Người Hùng Phút Cuối', en: '"Saint Iker" — Late-Game Savior' },
        duty: {
          vi: 'Vào sân thay César chấn thương ở phút 68 (khi mới 20 tuổi) và thực hiện 3 pha phản xạ xuất thần ở phút bù giờ bảo toàn tỷ số 2–1.',
          en: 'Came off the bench in the 68th minute and produced three miraculous stoppage-time saves to protect the 2–1 lead.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Sơ đồ 4-4-2 bất đối xứng của HLV Del Bosque: Makélélé (#24) giữ mỏ neo, Solari (#21) bù lấp biên trái để Zidane (#5) tự do sáng tạo.',
        en: 'Del Bosque’s asymmetric 4-4-2: Makélélé (#24) anchored the pivot while Solari (#21) balanced the left so Zidane (#5) could roam freely.',
      },
      overload: {
        vi: 'Tam giác lệch trái Roberto Carlos (#3) – Solari (#21) – Zidane (#5) liên tục khoét vào nách phải của Bayer Leverkusen.',
        en: 'Left-sided triangle of Roberto Carlos (#3), Solari (#21), and Zidane (#5) overloaded Leverkusen’s right flank.',
      },
      finisher: {
        vi: 'Quả ném biên 40m của R. Carlos cho Raúl mở tỷ số (8\'), cú vô-lê thế kỷ của Zidane (45\') và 3 pha cứu thua cuối trận của Iker Casillas.',
        en: 'Raúl’s 8th-minute opener, Zidane’s 45th-minute volley of the century, and Casillas’s late heroics clinched La Novena.',
      },
    },
  },

  // #10 - 2014: Real Madrid 4-1 Atlético Madrid (a.e.t.)
  10: {
    edition: 10,
    year: 2014,
    formation: '4-3-3 (La Décima Hybrid)',
    defaultSpotlightIdx: 3, // Ramos #4
    heatZones: [
      {
        id: '2014-z1',
        cx: 24,
        cy: 42,
        rx: 18,
        ry: 20,
        tone: 'gold',
        label: {
          vi: 'Hành lang đột phá Ziczac (Di María #22 + Marcelo #12)',
          en: 'Zig-Zag Dribbling Corridor (Di María #22 + Marcelo #12)',
        },
      },
      {
        id: '2014-z2',
        cx: 50,
        cy: 20,
        rx: 22,
        ry: 12,
        tone: 'crimson',
        label: {
          vi: 'Tọa độ vàng 92:48 (Ramos #4) & Đánh đầu hiệp phụ (Bale #11)',
          en: '92:48 Header (Ramos #4) & Extra-Time Clincher (Bale #11)',
        },
      },
      {
        id: '2014-z3',
        cx: 68,
        cy: 48,
        rx: 18,
        ry: 14,
        tone: 'cyan',
        label: {
          vi: 'Trục điều tiết & phạt góc chuẩn xác (Luka Modrić #19)',
          en: 'Metronome & 92:48 Corner Delivery (Luka Modrić #19)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 3, toIdx: 7, weight: 3 },
      { fromIdx: 2, toIdx: 5, weight: 3 },
      { fromIdx: 5, toIdx: 8, weight: 3 },
      { fromIdx: 7, toIdx: 10, weight: 3 },
      { fromIdx: 7, toIdx: 9, weight: 2 },
      { fromIdx: 4, toIdx: 7, weight: 3 },
      { fromIdx: 9, toIdx: 10, weight: 2 },
      { fromIdx: 5, toIdx: 6, weight: 2 },
    ],
    goalVectors: [
      {
        id: '2014-g1',
        fromIdx: 5,
        fromX: 88,
        fromY: 8,
        toIdx: 3,
        toX: 48,
        toY: 18,
        ctrlX: 72,
        ctrlY: 22,
        label: { vi: "Modrić ➔ Ramos [92:48' Đánh đầu]", en: "Modrić ➔ Ramos [92:48' Header]" },
      },
      {
        id: '2014-g2',
        fromIdx: 7,
        fromX: 32,
        fromY: 48,
        toIdx: 8,
        toX: 80,
        toY: 26,
        ctrlX: 42,
        ctrlY: 14,
        label: { vi: "Di María ➔ Bale [110' (2–1)]", en: "Di María ➔ Bale [110' (2–1)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 3, fromX: 40, fromY: 74, toX: 48, toY: 18 },
      { playerIdx: 7, fromX: 32, fromY: 48, toX: 20, toY: 16 },
      { playerIdx: 4, fromX: 18, fromY: 70, toX: 28, toY: 24 },
    ],
    playerRoles: {
      3: {
        roleTitle: { vi: 'Biểu Tượng Phút 92:48 (Mr. La Décima)', en: 'Mr. 92:48 — La Décima Savior' },
        duty: {
          vi: 'Băng cắt đánh đầu hiểm hóc vào góc xa từ quả phạt góc của Modrić ở phút 92 giây 48, cứu rỗi Real Madrid và mở ra kỷ nguyên hoàng kim.',
          en: 'Rose highest at 92:48 to power home Luka Modrić’s corner, shattering Atlético’s resistance and forcing extra time.',
        },
      },
      7: {
        roleTitle: { vi: 'Cầu Thủ Xuất Sắc Nhất Chung Kết ("El Fideo")', en: 'UEFA Final Man of the Match' },
        duty: {
          vi: 'Đá tiền vệ lệch trái trong sơ đồ 4-3-3 Hybrid; pha đi bóng ziczac qua 3 cầu thủ Atlético ở phút 110 kiến tạo bàn nâng tỷ số 2–1 cho Bale.',
          en: 'Played as a hybrid left-interior/winger; his slaloming 110th-minute dribble past three defenders set up Gareth Bale’s winner.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'HLV Carlo Ancelotti vận hành sơ đồ 4-3-3 Hybrid (biến chuyển sang 4-4-2 khi phòng ngự) và tung Marcelo + Isco vào hiệp 2 để đẩy cao tốc độ.',
        en: 'Carlo Ancelotti used a 4-3-3/4-4-2 hybrid and introduced Marcelo and Isco in the second half to pin Atlético inside their box.',
      },
      overload: {
        vi: 'Cánh trái bùng nổ dữ dội khi Di María (#22), Marcelo (#12) và Cristiano Ronaldo (#7) liên tục chồng biên đánh sập hành lang phải của Juanfran.',
        en: 'Left-flank overload with Di María (#22), Marcelo (#12), and Ronaldo (#7) relentlessly attacking Juanfran’s zone.',
      },
      finisher: {
        vi: 'Cú đánh đầu lịch sử phút 92:48 của Sergio Ramos (#4) gỡ hòa 1–1, trước khi Bale (110\'), Marcelo (118\') và Ronaldo (120\') hủy diệt hiệp phụ 4–1.',
        en: 'Ramos’s 92:48 header forced extra time before Bale (110\'), Marcelo (118\'), and Ronaldo (120\') sealed a 4–1 triumph.',
      },
    },
  },

  // #11 - 2016: Real Madrid 1-1 Atlético Madrid (5-3 pen)
  11: {
    edition: 11,
    year: 2016,
    formation: '4-3-3 (CMK Debut Balance)',
    defaultSpotlightIdx: 6, // Casemiro #14
    heatZones: [
      {
        id: '2016-z1',
        cx: 50,
        cy: 58,
        rx: 24,
        ry: 14,
        tone: 'cyan',
        label: {
          vi: 'Lá chắn thép đánh chặn (Casemiro #14: 8 pha tắc bóng)',
          en: 'Midfield Shield Zone (Casemiro #14: 8 Tackles)',
        },
      },
      {
        id: '2016-z2',
        cx: 32,
        cy: 46,
        rx: 18,
        ry: 15,
        tone: 'gold',
        label: {
          vi: 'Trục điều phối & đá phạt cố định (Toni Kroos #8)',
          en: 'Set-Piece & Tempo Control Hub (Toni Kroos #8)',
        },
      },
      {
        id: '2016-z3',
        cx: 50,
        cy: 18,
        rx: 22,
        ry: 11,
        tone: 'crimson',
        label: {
          vi: 'Tọa độ nối bóng đánh đầu (Bale #11 ➔ Ramos #4 [15\'])',
          en: 'Flick-On Goal Zone (Bale #11 ➔ Ramos #4 [15\'])',
        },
      },
    ],
    passLinks: [
      { fromIdx: 6, toIdx: 7, weight: 3 },
      { fromIdx: 6, toIdx: 5, weight: 3 },
      { fromIdx: 7, toIdx: 4, weight: 3 },
      { fromIdx: 5, toIdx: 8, weight: 3 },
      { fromIdx: 7, toIdx: 10, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 2 },
      { fromIdx: 3, toIdx: 7, weight: 2 },
    ],
    goalVectors: [
      {
        id: '2016-g1',
        fromIdx: 7,
        fromX: 32,
        fromY: 50,
        toIdx: 3,
        toX: 48,
        toY: 16,
        ctrlX: 62,
        ctrlY: 24,
        label: { vi: "Kroos ➔ Bale ➔ Ramos [15' (1–0)]", en: "Kroos ➔ Bale ➔ Ramos [15' (1–0)]" },
      },
      {
        id: '2016-g2',
        fromIdx: 10,
        fromX: 20,
        fromY: 24,
        toIdx: 9,
        toX: 50,
        toY: 10,
        ctrlX: 34,
        ctrlY: 12,
        label: { vi: 'C. Ronaldo [Loạt Pen thứ 5 (5–3)]', en: 'C. Ronaldo [5th Penalty Winner (5–3)]' },
      },
    ],
    tacticalRuns: [
      { playerIdx: 3, fromX: 40, fromY: 74, toX: 48, toY: 16 },
      { playerIdx: 8, fromX: 80, fromY: 26, toX: 56, toY: 18 },
    ],
    playerRoles: {
      6: {
        roleTitle: { vi: 'Mỏ Neo Kim Cương Của Zidane', en: 'Zidane’s Tactical Anchor' },
        duty: {
          vi: 'Mảnh ghép quyết định giúp tam giác CMK (Casemiro – Modrić – Kroos) cân bằng công thủ, thực hiện 8 cú tắc bóng và thu hồi bóng 15 lần tại San Siro.',
          en: 'Completed the legendary CMK midfield trio, recording 8 tackles and 15 ball recoveries across 120 grueling minutes.',
        },
      },
      3: {
        roleTitle: { vi: 'Đội Trưởng Mở Tỷ Số & Luân Lưu Lạnh Lùng', en: 'Captain & Final MVP' },
        duty: {
          vi: 'Ghi bàn mở tỷ số ở phút 15 và thực hiện thành công lượt sút luân lưu thứ 4, trở thành hậu vệ đầu tiên ghi bàn ở 2 trận chung kết Champions League.',
          en: 'Opened the scoring in the 15th minute and converted the 4th shootout penalty to win Man of the Match.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Trận chung kết đầu tiên của HLV Zinedine Zidane: Định hình bộ khung 4-3-3 chuẩn mực với sự kết hợp lịch sử CMK (Casemiro – Modrić – Kroos).',
        en: 'Zinedine Zidane’s first UCL Final established the iconic 4-3-3 anchored by the CMK midfield (Casemiro, Modrić, Kroos).',
      },
      overload: {
        vi: 'Gareth Bale (#11) thường xuyên bó vào trung lộ phối hợp cùng Modrić (#19), đồng thời thống trị hoàn toàn các pha không chiến.',
        en: 'Gareth Bale (#11) drifted inside to overload central zones alongside Modrić (#19) while dominating aerial duels.',
      },
      finisher: {
        vi: 'Ramos mở tỷ số phút 15 từ cú đánh đầu nối của Bale; trong loạt luân lưu, Vázquez, Marcelo, Bale, Ramos và C. Ronaldo sút thành công 5/5 quả.',
        en: 'Ramos scored in the 15th minute via Bale’s flick-on; Vázquez, Marcelo, Bale, Ramos, and Ronaldo went 5-for-5 in the shootout.',
      },
    },
  },

  // #12 - 2017: Real Madrid 4-1 Juventus
  12: {
    edition: 12,
    year: 2017,
    formation: '4-3-1-2 Diamond (Isco #22)',
    defaultSpotlightIdx: 8, // Isco #22
    heatZones: [
      {
        id: '2017-z1',
        cx: 34,
        cy: 46,
        rx: 20,
        ry: 15,
        tone: 'gold',
        label: {
          vi: 'Vùng quá tải Kim Cương (Isco #22 + Kroos #8 + Marcelo #12)',
          en: 'Diamond Overload Zone (Isco #22 + Kroos #8 + Marcelo #12)',
        },
      },
      {
        id: '2017-z2',
        cx: 78,
        cy: 40,
        rx: 16,
        ry: 20,
        tone: 'cyan',
        label: {
          vi: 'Tuyến khoét đáy & trả ngược (Carvajal #2 + Modrić #19)',
          en: 'Byline Cutback Corridor (Carvajal #2 + Modrić #19)',
        },
      },
      {
        id: '2017-z3',
        cx: 48,
        cy: 22,
        rx: 22,
        ry: 12,
        tone: 'crimson',
        label: {
          vi: 'Vùng kết liễu 1 chạm (C. Ronaldo #7) & Sút xa (Casemiro #14)',
          en: 'One-Touch Clinical Zone (CR7 #7) & Long Shot (Casemiro #14)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 6, toIdx: 7, weight: 3 },
      { fromIdx: 6, toIdx: 5, weight: 3 },
      { fromIdx: 7, toIdx: 8, weight: 3 },
      { fromIdx: 5, toIdx: 8, weight: 3 },
      { fromIdx: 4, toIdx: 8, weight: 3 },
      { fromIdx: 1, toIdx: 5, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 2 },
      { fromIdx: 8, toIdx: 10, weight: 3 },
      { fromIdx: 9, toIdx: 10, weight: 2 },
    ],
    goalVectors: [
      {
        id: '2017-g1',
        fromIdx: 1,
        fromX: 82,
        fromY: 72,
        toIdx: 10,
        toX: 36,
        toY: 20,
        ctrlX: 78,
        ctrlY: 22,
        label: { vi: "Carvajal ➔ C. Ronaldo [20' (1–0)]", en: "Carvajal ➔ C. Ronaldo [20' (1–0)]" },
      },
      {
        id: '2017-g2',
        fromIdx: 6,
        fromX: 50,
        fromY: 58,
        toIdx: 10,
        toX: 48,
        toY: 14,
        ctrlX: 58,
        ctrlY: 36,
        label: { vi: "Casemiro [61' Sút xa 30m (2–1)]", en: "Casemiro [61' 30m Strike (2–1)]" },
      },
      {
        id: '2017-g3',
        fromIdx: 5,
        fromX: 68,
        fromY: 52,
        toIdx: 10,
        toX: 36,
        toY: 20,
        ctrlX: 82,
        ctrlY: 14,
        label: { vi: "Modrić ➔ C. Ronaldo [64' (3–1)]", en: "Modrić ➔ C. Ronaldo [64' (3–1)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 8, fromX: 50, fromY: 36, toX: 34, toY: 38 },
      { playerIdx: 1, fromX: 82, fromY: 72, toX: 84, toY: 24 },
      { playerIdx: 4, fromX: 18, fromY: 70, toX: 16, toY: 24 },
    ],
    playerRoles: {
      8: {
        roleTitle: { vi: 'Đỉnh Kim Cương Tự Do (Free Role #10)', en: '4-3-1-2 Free Diamond Apex' },
        duty: {
          vi: 'Di chuyển lệch trái tạo thế 4 đánh 2 ở trung tuyến với Kroos – Modrić – Casemiro, làm tê liệt hoàn toàn trục Pjanić – Khedira của Juventus.',
          en: 'Drifted left to create a 4v2 midfield overload alongside CMK, dismantling Juventus’s Pjanić–Khedira double pivot.',
        },
      },
      10: {
        roleTitle: { vi: 'Sát Thủ Vòng Cấm — Cú Đúp Lịch Sử', en: '2-Goal Final MVP (600th Career Goal)' },
        duty: {
          vi: 'Bó vào trung lộ đá cặp tiền đạo với Benzema; dứt điểm một chạm sắc lẹm ở phút 20 và 64 để chạm mốc 600 bàn thắng trong sự nghiệp.',
          en: 'Operated as an inside striker, scoring two clinical one-touch finishes (20\', 64\') against Buffon.',
        },
      },
      5: {
        roleTitle: { vi: 'Động Cơ Thoát Pressing & Kiến Tạo', en: 'Press-Resistant Midfield Maestro' },
        duty: {
          vi: 'Cướp bóng bên phần sân đối phương và bứt tốc xuống sát đáy biên phải ở phút 64 để căng ngang dọn cỗ cho Ronaldo nâng tỷ số lên 3–1.',
          en: 'Intercepted the ball high upfield and surged to the right byline in the 64th minute to assist Ronaldo’s second goal.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Đỉnh cao chiến thuật của HLV Zinedine Zidane với sơ đồ 4-3-1-2 Kim Cương: Isco (#22) đá hộ công sau cặp tiền đạo Benzema (#9) – Ronaldo (#7).',
        en: 'Zidane’s tactical masterpiece: a 4-3-1-2 Diamond with Isco (#22) floating behind dual strikers Benzema (#9) and Ronaldo (#7).',
      },
      overload: {
        vi: 'Isco (#22) kéo lệch trái phối hợp cùng Kroos (#8) và Marcelo (#12), hút toàn bộ khối phòng ngự Juventus để mở toang cánh phải cho Carvajal (#2) và Modrić (#19).',
        en: 'Isco (#22) overloaded the left with Kroos (#8) and Marcelo (#12), opening the right half-space for Carvajal (#2) and Modrić (#19) to attack.',
      },
      finisher: {
        vi: 'Juventus chỉ thủng lưới 3 bàn cả mùa C1 nhưng bị Real Madrid nã 4 bàn tại Cardiff: Ronaldo (20\', 64\'), Casemiro (61\') và Asensio (90\' từ đường trả ngược của Marcelo).',
        en: 'Juventus had conceded just 3 goals all tournament before Madrid struck 4 times: Ronaldo (20\', 64\'), Casemiro (61\'), and Asensio (90\').',
      },
    },
  },

  // #13 - 2018: Real Madrid 3-1 Liverpool
  13: {
    edition: 13,
    year: 2018,
    formation: '4-3-1-2 ➔ 4-3-3 (Bale Impact)',
    defaultSpotlightIdx: 8, // Isco / Bale #11
    heatZones: [
      {
        id: '2018-z1',
        cx: 50,
        cy: 54,
        rx: 26,
        ry: 14,
        tone: 'cyan',
        label: {
          vi: 'Tam giác thoát Gegenpressing (Kroos #8 + Casemiro #14 + Modrić #10)',
          en: 'Gegenpress-Breaking Triangle (Kroos #8 + Casemiro #14 + Modrić #10)',
        },
      },
      {
        id: '2018-z2',
        cx: 50,
        cy: 22,
        rx: 20,
        ry: 12,
        tone: 'crimson',
        label: {
          vi: 'Tọa độ siêu phẩm xe đạp chổng ngược (Gareth Bale #11 [64\'])',
          en: 'Overhead Bicycle-Kick Zone (Gareth Bale #11 [64\'])',
        },
      },
      {
        id: '2018-z3',
        cx: 20,
        cy: 42,
        rx: 15,
        ry: 18,
        tone: 'gold',
        label: {
          vi: 'Hành lang kiến tạo của Marcelo (#12: 2 kiến tạo)',
          en: 'Playmaking Left Wing-Back Zone (Marcelo #12: 2 Assists)',
        },
      },
    ],
    passLinks: [
      { fromIdx: 6, toIdx: 7, weight: 3 },
      { fromIdx: 6, toIdx: 5, weight: 3 },
      { fromIdx: 7, toIdx: 4, weight: 3 },
      { fromIdx: 4, toIdx: 8, weight: 3 },
      { fromIdx: 4, toIdx: 10, weight: 3 },
      { fromIdx: 5, toIdx: 8, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 2 },
      { fromIdx: 2, toIdx: 5, weight: 2 },
    ],
    goalVectors: [
      {
        id: '2018-g1',
        fromIdx: 9,
        fromX: 50,
        fromY: 20,
        toIdx: 9,
        toX: 50,
        toY: 12,
        ctrlX: 42,
        ctrlY: 14,
        label: { vi: "Benzema [51' Bắt bài Karius (1–0)]", en: "Benzema [51' Press Goal (1–0)]" },
      },
      {
        id: '2018-g2',
        fromIdx: 4,
        fromX: 18,
        fromY: 70,
        toIdx: 8,
        toX: 52,
        toY: 22,
        ctrlX: 22,
        ctrlY: 28,
        label: { vi: "Marcelo ➔ Bale [64' Xe đạp chổng ngược]", en: "Marcelo ➔ Bale [64' Bicycle Kick]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 8, fromX: 76, fromY: 30, toX: 52, toY: 22 },
      { playerIdx: 4, fromX: 18, fromY: 70, toX: 18, toY: 28 },
    ],
    playerRoles: {
      8: {
        roleTitle: { vi: 'Siêu Dự Bị Lịch Sử — Cú Đúp & Xe Đạp Chổng Ngược', en: 'Historic Super-Sub (Bicycle Kick Brace)' },
        duty: {
          vi: 'Vào sân phút 61 thay Isco, chỉ 122 giây sau đã tung cú móc bóng xe đạp chổng ngược để đời từ quả tạt của Marcelo và sút xa 30m ấn định tỷ số 3–1.',
          en: 'Entered in the 61st minute and scored an iconic overhead bicycle kick 122 seconds later, followed by a 30m knuckleball for 3–1.',
        },
      },
      9: {
        roleTitle: { vi: 'Trung Phong Kiến Tạo & Gây Áp Lực Tầm Cao', en: 'Pressing & Link-Up #9' },
        duty: {
          vi: 'Di chuyển thông minh đọc tình huống ném bóng của Karius ở phút 51 để ghi bàn mở tỷ số 1–0 và liên tục làm tường cho hàng công.',
          en: 'Read Loris Karius’s throw in the 51st minute to score the opening goal and linked play seamlessly across the frontline.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Khởi đầu bằng sơ đồ 4-3-1-2 kiểm soát bóng để giảm nhịp Gegenpressing của Liverpool, trước khi chuyển sang 4-3-3 ở phút 61 khi Gareth Bale vào sân.',
        en: 'Started in a 4-3-1-2 to absorb Liverpool’s Gegenpressing before shifting to 4-3-3 when Gareth Bale entered in the 61st minute.',
      },
      overload: {
        vi: 'Bộ ba Kroos (#8) – Casemiro (#14) – Modrić (#10) đạt tỷ lệ chuyền chính xác 91%, kéo giãn tuyến giữa Liverpool để Marcelo (#12) tự do dâng cao bên cánh trái.',
        en: 'CMK completed 91% of their passes to bypass Liverpool’s press, releasing Marcelo (#12) high up the left wing.',
      },
      finisher: {
        vi: 'Benzema mở điểm phút 51, và Gareth Bale (#11) lập cú đúp lịch sử (xe đạp chổng ngược phút 64 + sút xa phút 83) hoàn tất kỳ tích 3 Cúp C1 liên tiếp.',
        en: 'Benzema opened the scoring (51\') before Gareth Bale’s legendary brace (64\' bicycle kick, 83\' long shot) sealed the historic Three-Peat.',
      },
    },
  },

  // #14 - 2022: Real Madrid 1-0 Liverpool
  14: {
    edition: 14,
    year: 2022,
    formation: '4-3-3 / 4-4-2 Asymmetric (Valverde RW)',
    defaultSpotlightIdx: 0, // Courtois #1
    heatZones: [
      {
        id: '2022-z1',
        cx: 50,
        cy: 86,
        rx: 24,
        ry: 11,
        tone: 'gold',
        label: {
          vi: 'Bức tường phản xạ kỷ lục (Courtois #1: 9 pha cứu thua)',
          en: 'Record Goalkeeping Wall (Courtois #1: 9 Saves)',
        },
      },
      {
        id: '2022-z2',
        cx: 76,
        cy: 42,
        rx: 16,
        ry: 20,
        tone: 'cyan',
        label: {
          vi: 'Trục thoát pressing & tịnh tiến bóng (Valverde #15 + Modrić #10)',
          en: 'Press-Breaking Progression Lane (Valverde #15 + Modrić #10)',
        },
      },
      {
        id: '2022-z3',
        cx: 24,
        cy: 20,
        rx: 18,
        ry: 12,
        tone: 'crimson',
        label: {
          vi: 'Điểm nổ khoét sau lưng hậu vệ cánh (Vinícius Jr #20 [59\'])',
          en: 'Back-Post Blindside Strike Zone (Vinícius Jr #20 [59\'])',
        },
      },
    ],
    passLinks: [
      { fromIdx: 0, toIdx: 2, weight: 2 },
      { fromIdx: 1, toIdx: 5, weight: 3 },
      { fromIdx: 6, toIdx: 5, weight: 3 },
      { fromIdx: 6, toIdx: 7, weight: 3 },
      { fromIdx: 5, toIdx: 8, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 2 },
      { fromIdx: 8, toIdx: 10, weight: 3 },
      { fromIdx: 7, toIdx: 10, weight: 3 },
    ],
    goalVectors: [
      {
        id: '2022-g1',
        fromIdx: 8,
        fromX: 80,
        fromY: 30,
        toIdx: 10,
        toX: 20,
        toY: 24,
        ctrlX: 54,
        ctrlY: 12,
        label: { vi: "Valverde ➔ Vinícius Jr [59' (1–0)]", en: "Valverde ➔ Vinícius Jr [59' (1–0)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 8, fromX: 80, fromY: 30, toX: 82, toY: 18 },
      { playerIdx: 10, fromX: 20, fromY: 24, toX: 32, toY: 14 },
      { playerIdx: 9, fromX: 50, fromY: 20, toX: 56, toY: 34 },
    ],
    playerRoles: {
      0: {
        roleTitle: { vi: 'Cầu Thủ Xuất Sắc Nhất Chung Kết (9 Pha Cứu Thua)', en: 'Final MVP — Record 9 Saves' },
        duty: {
          vi: 'Lập kỷ lục mọi thời đại trong một trận chung kết Champions League với 9 pha cứu thua xuất thần trước Salah và Mané (xG cản phá > 2.5).',
          en: 'Set an all-time Champions League Final record with 9 saves against Salah and Mané, denying over 2.5 expected goals.',
        },
      },
      8: {
        roleTitle: { vi: 'Mũi Khoan Lai Tiền Vệ - Tiền Đạo Cánh Phải', en: 'Hybrid Right-Wing Box-to-Box' },
        duty: {
          vi: 'Lùi về tạo hàng tiền vệ 4 người khi phòng ngự và bứt tốc xé gió bên cánh phải ở phút 59 để căng ngang kiến tạo cho Vinícius Jr.',
          en: 'Tucked in to form a 4-man midfield out of possession before surging down the right in the 59th minute to assist Vinícius Jr.',
        },
      },
      10: {
        roleTitle: { vi: 'Mũi Nhọn Khoét Sau Lưng Trent Alexander-Arnold', en: 'Back-Post Match Winner' },
        duty: {
          vi: 'Ẩn mình ở điểm mù phía sau lưng hàng thủ Liverpool và băng vào đệm bóng cận thành phút 59 mang về chức vô địch C1 thứ 14.',
          en: 'Attacked the blindside behind Liverpool’s right-back to tap home Valverde’s driven cross in the 59th minute.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'HLV Carlo Ancelotti bố trí khối phòng ngự tầm trung-thấp cực kỳ điềm tĩnh: Valverde (#15) lùi xuống tạo thành 4-4-2, nhường quyền cầm bóng ảo cho Liverpool.',
        en: 'Carlo Ancelotti deployed a calm mid-low block where Valverde (#15) tucked inside into a 4-4-2, inviting Liverpool’s press to exploit space behind.',
      },
      overload: {
        vi: 'Phút 59, pha phối hợp thoát pressing 11 chạm từ phần sân nhà qua Carvajal – Modrić – Casemiro giải phóng Valverde (#15) băng lên trống trải bên cánh phải.',
        en: 'An 11-pass press-breaking sequence through Carvajal, Modrić, and Casemiro released Valverde (#15) into open space on the right flank.',
      },
      finisher: {
        vi: 'Valverde căng ngang sệt cắt mặt khung thành cho Vinícius Jr (#20) đệm bóng cột hai (59\'), kết hợp cùng 9 pha cứu thua lịch sử của Thibaut Courtois (#1).',
        en: 'Valverde’s driven low cross was tapped in at the far post by Vinícius Jr (#20, 59\'), backed by Thibaut Courtois’s record 9 saves.',
      },
    },
  },

  // #15 - 2024: Real Madrid 2-0 Borussia Dortmund
  15: {
    edition: 15,
    year: 2024,
    formation: '4-3-1-2 Diamond ➔ 4-3-3 Asymmetric',
    defaultSpotlightIdx: 8, // Bellingham #5
    heatZones: [
      {
        id: '2024-z1',
        cx: 32,
        cy: 48,
        rx: 20,
        ry: 15,
        tone: 'gold',
        label: {
          vi: 'Trục điều tiết & đá phạt góc (Kroos #8 + Camavinga #12)',
          en: 'Metronome & Corner Delivery Hub (Kroos #8 + Camavinga #12)',
        },
      },
      {
        id: '2024-z2',
        cx: 50,
        cy: 30,
        rx: 22,
        ry: 13,
        tone: 'cyan',
        label: {
          vi: 'Vùng pressing tầm cao & kiến tạo (Jude Bellingham #5)',
          en: 'High-Press & Box-Entry Zone (Jude Bellingham #5)',
        },
      },
      {
        id: '2024-z3',
        cx: 42,
        cy: 18,
        rx: 24,
        ry: 11,
        tone: 'crimson',
        label: {
          vi: 'Cắt mặt đánh đầu (Carvajal #2 [74\']) & Dứt điểm chéo góc (Vinícius #7 [83\'])',
          en: 'Near-Post Header (Carvajal #2 [74\']) & Clinical Finish (Vinícius #7 [83\'])',
        },
      },
    ],
    passLinks: [
      { fromIdx: 6, toIdx: 7, weight: 3 },
      { fromIdx: 6, toIdx: 5, weight: 3 },
      { fromIdx: 7, toIdx: 8, weight: 3 },
      { fromIdx: 7, toIdx: 10, weight: 3 },
      { fromIdx: 5, toIdx: 1, weight: 3 },
      { fromIdx: 5, toIdx: 9, weight: 3 },
      { fromIdx: 8, toIdx: 10, weight: 3 },
      { fromIdx: 8, toIdx: 9, weight: 2 },
      { fromIdx: 2, toIdx: 6, weight: 2 },
    ],
    goalVectors: [
      {
        id: '2024-g1',
        fromIdx: 7,
        fromX: 12,
        fromY: 8,
        toIdx: 1,
        toX: 46,
        toY: 16,
        ctrlX: 28,
        ctrlY: 22,
        label: { vi: "Kroos Phạt góc ➔ Carvajal [74' (1–0)]", en: "Kroos Corner ➔ Carvajal [74' (1–0)]" },
      },
      {
        id: '2024-g2',
        fromIdx: 8,
        fromX: 50,
        fromY: 34,
        toIdx: 10,
        toX: 34,
        toY: 20,
        ctrlX: 42,
        ctrlY: 22,
        label: { vi: "Bellingham ➔ Vinícius Jr [83' (2–0)]", en: "Bellingham ➔ Vinícius Jr [83' (2–0)]" },
      },
    ],
    tacticalRuns: [
      { playerIdx: 1, fromX: 82, fromY: 72, toX: 46, toY: 16 },
      { playerIdx: 10, fromX: 34, fromY: 20, toX: 28, toY: 12 },
      { playerIdx: 8, fromX: 50, fromY: 34, toX: 50, toY: 18 },
    ],
    playerRoles: {
      8: {
        roleTitle: { vi: 'Đỉnh Kim Cương & Kiến Tạo Quyết Định (#5)', en: 'Diamond #10 & Match-Sealing Creator' },
        duty: {
          vi: 'Hoạt động như số 9 ảo kiêm tiền vệ tấn công; cắt đường chuyền ngang của Maatsen ở phút 83 và kiến tạo dọn cỗ cho Vinícius Jr ấn định 2–0.',
          en: 'Operated as a box-crashing #10; intercepted Maatsen’s pass in the 83rd minute and assisted Vinícius Jr for the 2–0 clincher.',
        },
      },
      1: {
        roleTitle: { vi: 'Cầu Thủ Xuất Sắc Nhất Chung Kết — Người Hùng Cột Gần', en: 'UEFA Final MVP — Near-Post Hero' },
        duty: {
          vi: 'Dù chỉ cao 1m73 nhưng bật cao dũng mãnh cắt mặt đánh đầu tung lưới Dortmund ở phút 74 từ quả phạt góc của Toni Kroos.',
          en: 'Despite standing 1.73m, rose highest at the near post in the 74th minute to head home Toni Kroos’s corner.',
        },
      },
      7: {
        roleTitle: { vi: 'Nhạc Trưởng Trong Vũ Điệu Cuối Cùng (97% Chuyền Đúng)', en: 'The Maestro’s Last Dance (97% Pass Acc.)' },
        duty: {
          vi: 'Trận đấu cuối cùng trong màu áo CLB của Toni Kroos: Thực hiện 91/94 đường chuyền chính xác và treo bóng chuẩn từng milimet cho Carvajal mở tỷ số.',
          en: 'In his final club match, Toni Kroos completed 91 of 94 passes and delivered the pinpoint 74th-minute corner assist.',
        },
      },
      10: {
        roleTitle: { vi: 'Mũi Khoan Cánh Trái — Ghi Bàn Ở 2 Trận Chung Kết C1', en: 'Left-Wing Superstar — Scored in 2 UCL Finals' },
        duty: {
          vi: 'Liên tục tra tấn hành lang phải của Ryerson trong hiệp 2 (8 pha qua người thành công) và bấm bóng chân trái tinh tế ấn định tỷ số 2–0 phút 83.',
          en: 'Completed 8 dribbles in the second half and calmly chipped Kobel in the 83rd minute to become the youngest player to score in two UCL Finals.',
        },
      },
    },
    breakdown: {
      structure: {
        vi: 'Hiệp 1 đá 4-3-1-2 Kim Cương chịu trận trước Dortmund; sang hiệp 2 HLV Carlo Ancelotti đẩy Bellingham (#5) lệch trái và kéo Valverde (#15) bó vào giúp kiểm soát hoàn toàn thế trận.',
        en: 'Started in a 4-3-1-2 Diamond before Ancelotti adjusted in the second half—shifting Bellingham (#5) left to overload Dortmund’s right flank.',
      },
      overload: {
        vi: 'Trục trái Kroos (#8) – Camavinga (#12) – Bellingham (#5) – Vinícius Jr (#7) dồn ép liên tục từ phút 60, tạo ra chuỗi 5 quả phạt góc nguy hiểm liên tiếp.',
        en: 'Left-sided overload of Kroos (#8), Camavinga (#12), Bellingham (#5), and Vinícius Jr (#7) pinned Dortmund deep and forced repeated corners.',
      },
      finisher: {
        vi: 'Quả phạt góc chuẩn xác của Toni Kroos (#8) cho Dani Carvajal (#2) đánh đầu cắt mặt mở tỷ số (74\'), tiếp nối bằng pha pressing kiến tạo của Bellingham cho Vinícius Jr ấn định 2–0 (83\').',
        en: 'Toni Kroos’s corner was headed in by Dani Carvajal (74\') before Bellingham intercepted and fed Vinícius Jr (83\') to seal La Decimoquinta.',
      },
    },
  },
};
