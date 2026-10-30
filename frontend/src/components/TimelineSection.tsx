import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Compass,
  Crown,
  Landmark,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Wrench,
} from 'lucide-react';
import { HistoricalEra, Language } from '../types/database';

interface TimelineSectionProps {
  eras: HistoricalEra[];
  lang: Language;
}

interface DeepEraEncyclopedia {
  id: string;
  period: string;
  titleVi: string;
  titleEn: string;
  trophiesWon: number;
  contextVi: string;
  contextEn: string;
  milestonesVi: Array<{ date: string; event: string }>;
  milestonesEn: Array<{ date: string; event: string }>;
  tacticalFormationVi: string;
  tacticalFormationEn: string;
  leadershipVi: string;
  leadershipEn: string;
  iconicMatchVi: string;
  iconicMatchEn: string;
  recordsVi: string[];
  recordsEn: string[];
  icons: string[];
}

const DEEP_ERAS: DeepEraEncyclopedia[] = [
  {
    id: 'era-1',
    period: '1902–1943',
    titleVi: '1. Khởi Nguồn Hoàng Gia & Vương Miện "Real" (1902–1943)',
    titleEn: '1. Royal Genesis & King Alfonso XIII’s Crown (1902–1943)',
    trophiesWon: 9,
    contextVi:
      'Được sáng lập bởi các cựu sinh viên Institución Libre de Enseñanza và hai anh em người xứ Catalunya là Juan Padrós & Carlos Padrós vào ngày 06/03/1902 dưới tên gọi Madrid Foot-Ball Club. Ngay trong thập niên đầu tiên, CLB đã thống trị Tây Ban Nha với 4 chức vô địch Copa del Rey liên tiếp (1905–1908), đồng thời là thành viên sáng lập Liên đoàn Bóng đá Hoàng gia Tây Ban Nha (RFEF) và FIFA (1904). Ngày 29/06/1920, Vua Alfonso XIII chính thức ban sắc lệnh Hoàng gia cho phép CLB mang danh xưng "Real" (Hoàng gia) cùng biểu tượng Vương miện trên logo.',
    contextEn:
      'Founded on March 6, 1902 by brothers Juan and Carlos Padrós as Madrid Foot-Ball Club. The club rapidly dominated Spanish football with four consecutive Copa del Rey titles (1905–1908) and co-founded FIFA in 1904. On June 29, 1920, King Alfonso XIII granted the title "Real" (Royal) and the royal crown on the crest.',
    milestonesVi: [
      {
        date: '06/03/1902',
        event:
          'Anh em Juan Padrós & Carlos Padrós chính thức thành lập Madrid Foot-Ball Club, chọn sắc áo Trắng tinh khiết làm trang phục truyền thống.',
      },
      {
        date: '1905–1908',
        event:
          'Thống trị tuyệt đối giải vô địch quốc gia lâu đời nhất Tây Ban Nha với 4 cúp Copa del Rey liên tiếp (thắng Athletic Bilbao và Vigo Sporting).',
      },
      {
        date: '29/06/1920',
        event:
          'Đức vua Alfonso XIII ban tước hiệu "Real" (Hoàng gia), đổi tên CLB thành Real Madrid và gắn vương miện lên huy hiệu.',
      },
      {
        date: '1931–1933',
        event:
          'Vô địch La Liga lần đầu tiên trong lịch sử với thành tích bất bại cả mùa 1931/32 (10 thắng, 8 hòa) và bảo vệ ngôi vương mùa 1932/33 cùng thủ thành Ricardo Zamora.',
      },
    ],
    milestonesEn: [
      {
        date: '06/03/1902',
        event:
          'Juan and Carlos Padrós officially establish Madrid Foot-Ball Club in iconic all-white kits.',
      },
      {
        date: '1905–1908',
        event:
          'Four consecutive Copa del Rey triumphs, establishing Madrid as the premier force in Spain.',
      },
      {
        date: '29/06/1920',
        event:
          'King Alfonso XIII bestows the "Real" (Royal) title and royal crown upon the club.',
      },
      {
        date: '1931–1933',
        event:
          'Unbeaten 1931/32 maiden La Liga championship followed by back-to-back title in 1932/33 led by goalkeeper Ricardo Zamora.',
      },
    ],
    tacticalFormationVi: '2-3-5 Pyramid cổ điển & WM (3-2-2-3) tốc độ hai biên',
    tacticalFormationEn: 'Classic 2-3-5 Pyramid & WM (3-2-2-3) System',
    leadershipVi: 'Chủ tịch: Juan Padrós, Carlos Padrós, Adolfo Meléndez, Pedro Parages | HLV: Arthur Johnson, Lippo Hertzka, Robert Firth',
    leadershipEn: 'Presidents: Juan & Carlos Padrós, Pedro Parages | Managers: Arthur Johnson, Lippo Hertzka',
    iconicMatchVi: 'Real Madrid 11–1 Barcelona (13/06/1943 — Bán kết lượt về Copa del Generalísimo tại Chamartín)',
    iconicMatchEn: 'Real Madrid 11–1 Barcelona (13/06/1943 — Copa Semi-final 2nd Leg at Chamartín)',
    recordsVi: [
      'CLB đầu tiên trong lịch sử Tây Ban Nha giành 4 Copa del Rey liên tiếp (1905–1908)',
      'Nhà vô địch La Liga bất bại đầu tiên mùa 1931/32 (18 trận không thua)',
      'Chiến thắng đậm nhất lịch sử El Clásico: 11–1 (1943)',
    ],
    recordsEn: [
      'First Spanish club to win 4 consecutive Copa del Rey titles (1905–1908)',
      'Unbeaten 1931/32 La Liga champions (18 matches undefeated)',
      'Largest victory in El Clásico history: 11–1 (1943)',
    ],
    icons: ['Santiago Bernabéu', 'Arthur Johnson', 'Ricardo Zamora', 'Jacinto Quincoces', 'Josep Samitier'],
  },
  {
    id: 'era-2',
    period: '1943–1966',
    titleVi: '2. Đế Chế Santiago Bernabéu, Di Stéfano & 5 Cúp C1 Liên Tiếp + Thế Hệ Yé-Yé',
    titleEn: '2. Bernabéu, Di Stéfano, 5-Peat European Cups & The Yé-Yé Generation',
    trophiesWon: 22,
    contextVi:
      'Ngày 15/09/1943, Santiago Bernabéu đắc cử Chủ tịch và khởi xướng hai quyết định vĩ đại làm thay đổi lịch sử bóng đá thế giới: xây dựng siêu sân vận động Nuevo Chamartín (1947) và chiêu mộ "Mũi tên bạc" Alfredo Di Stéfano (1953). Kết hợp cùng Ferenc Puskás, Raymond Kopa và Paco Gento, Real Madrid độc bá châu Âu với 5 chức vô địch Cúp C1 liên tiếp (1956–1960). Năm 1966, thế hệ "Yé-yé" gồm 11 cầu thủ Tây Ban Nha do Amancio Amaro và Pirri dẫn dắt đã đánh bại Partizan Belgrade 2–1 để mang về chiếc Cúp C1 thứ 6.',
    contextEn:
      'Under President Santiago Bernabéu (elected September 15, 1943), Madrid built the Nuevo Chamartín stadium (1947) and signed Alfredo Di Stéfano in 1953. Alongside Ferenc Puskás, Raymond Kopa, and Paco Gento, Madrid won the first 5 European Cups in history (1956–1960), followed by the all-Spanish "Yé-yé" generation winning the 6th European Cup in 1966.',
    milestonesVi: [
      {
        date: '14/12/1947 & 23/09/1953',
        event:
          'Khánh thành sân Nuevo Chamartín (1947) và ra mắt Alfredo Di Stéfano (1953) — tròn 1 tháng sau ông lập cú đúp giúp Real Madrid đè bẹp Barcelona 5–0.',
      },
      {
        date: '13/06/1956 – 18/05/1960',
        event:
          'Kỷ lục vô tiền khoáng hậu 5 Cúp C1 châu Âu liên tiếp, khép lại bằng trận Chung kết vĩ đại nhất lịch sử tại Hampden Park 1960: thắng Eintracht Frankfurt 7–3 (Puskás 4 bàn, Di Stéfano 3 bàn).',
      },
      {
        date: '04/09/1960',
        event:
          'Đánh bại Peñarol 5–1 tại Bernabéu để đăng quang Cúp Liên lục địa (Intercontinental Cup) đầu tiên trong lịch sử bóng đá thế giới.',
      },
      {
        date: '11/05/1966',
        event:
          'Thế hệ "Yé-yé" với 100% cầu thủ bản địa Tây Ban Nha dưới sự chỉ huy của lão tướng Paco Gento lội ngược dòng hạ Partizan 2–1 tại Brussels, đoạt Cúp C1 lần thứ 6.',
      },
    ],
    milestonesEn: [
      {
        date: '14/12/1947 & 23/09/1953',
        event:
          'Inauguration of Nuevo Chamartín (1947) and debut of Alfredo Di Stéfano (1953), who scored a brace in a 5–0 rout of Barcelona.',
      },
      {
        date: '13/06/1956 – 18/05/1960',
        event:
          'Unmatched 5 consecutive European Cups, culminating in the 7–3 Hampden Park masterpiece vs Eintracht Frankfurt (Puskás 4, Di Stéfano 3).',
      },
      {
        date: '04/09/1960',
        event:
          'Defeated Peñarol 5–1 to become the inaugural Intercontinental Cup World Champions.',
      },
      {
        date: '11/05/1966',
        event:
          'The all-Spanish "Yé-yé" team captained by Paco Gento defeated Partizan 2–1 in Brussels to claim the 6th European Cup.',
      },
    ],
    tacticalFormationVi: '3-2-5 / 4-2-4 Toàn diện (Di Stéfano lùi sâu kiến thiết tự do từ vòng cấm địa nhà đến vòng cấm đối phương)',
    tacticalFormationEn: 'Fluid 3-2-5 / 4-2-4 Total Football Prototype anchored by Di Stéfano',
    leadershipVi: 'Chủ tịch: Santiago Bernabéu | HLV: José Villalonga, Luis Carniglia, Miguel Muñoz (14 danh hiệu)',
    leadershipEn: 'President: Santiago Bernabéu | Managers: José Villalonga, Luis Carniglia, Miguel Muñoz',
    iconicMatchVi: 'Real Madrid 7–3 Eintracht Frankfurt (18/05/1960 — Chung kết Cúp C1 trước 127.621 khán giả tại Glasgow)',
    iconicMatchEn: 'Real Madrid 7–3 Eintracht Frankfurt (18/05/1960 — European Cup Final at Hampden Park, 127,621 fans)',
    recordsVi: [
      '5 chức vô địch Cúp C1 liên tiếp (1956–1960) — kỷ lục vĩnh cửu của lịch sử bóng đá châu Âu',
      'Alfredo Di Stéfano ghi bàn trong cả 5 trận Chung kết Cúp C1 liên tiếp (7 bàn)',
      'Paco Gento giành 6 Cúp C1 và 12 La Liga sau 18 mùa giải',
    ],
    recordsEn: [
      '5 consecutive European Cups (1956–1960) — all-time European record',
      'Alfredo Di Stéfano scored in 5 consecutive European Cup Finals (7 goals)',
      'Paco Gento won 6 European Cups and 12 La Liga titles',
    ],
    icons: ['Alfredo Di Stéfano', 'Ferenc Puskás', 'Paco Gento', 'Raymond Kopa', 'Amancio Amaro', 'Pirri'],
  },
  {
    id: 'era-3',
    period: '1967–1990',
    titleVi: '3. Tinh Thần Juanito, Đêm Remontada UEFA Cup & La Quinta del Buitre (5 La Liga Liên Tiếp)',
    titleEn: '3. Spirit of Juanito, UEFA Cup Remontadas & La Quinta del Buitre (1967–1990)',
    trophiesWon: 23,
    contextVi:
      'Giai đoạn bản sắc Tây Ban Nha trỗi dậy mạnh mẽ. Thập niên 1970–1980 chứng kiến tinh thần chiến đấu rực lửa của Santillana, Camacho và Juanito với câu nói bất hủ "90 minuti en el Bernabéu son molto longo" cùng những màn lội ngược dòng thần thánh tại Cúp UEFA 1985 và 1986. Từ năm 1986 đến 1990, thế hệ vàng "La Quinta del Buitre" (Bộ ngũ Kền kền: Emilio Butragueño, Míchel, Manolo Sanchís, Martín Vázquez, Miguel Pardeza) kết hợp cùng cỗ máy săn bàn Hugo Sánchez đã thống trị tuyệt đối Tây Ban Nha với 5 chức vô địch La Liga liên tiếp.',
    contextEn:
      'Forged by the fiery spirit of Juanito, Santillana, and Camacho ("90 minuti en el Bernabéu son molto longo"), Madrid staged legendary European comebacks to win back-to-back UEFA Cups (1985, 1986). From 1986 to 1990, the homegrown "La Quinta del Buitre" led by Emilio Butragueño and Mexican striker Hugo Sánchez captured 5 consecutive La Liga titles.',
    milestonesVi: [
      {
        date: '1978–1980',
        event:
          'Chủ tịch Luis de Carlos kế nhiệm Santiago Bernabéu; CLB giành 3 La Liga liên tiếp (1978, 1979, 1980) và cú đúp quốc nội mùa 1979/80.',
      },
      {
        date: '11/12/1985 & 1985–1986',
        event:
          'Màn lội ngược dòng lịch sử thắng Borussia Mönchengladbach 4–0 tại Bernabéu (sau khi thua 1–5 lượt đi) và giành 2 Cúp UEFA liên tiếp (1985, 1986).',
      },
      {
        date: '1986–1990',
        event:
          'Thế hệ "La Quinta del Buitre" thiết lập kỷ lục 5 chức vô địch La Liga liên tiếp, đỉnh cao là mùa 1989/90 ghi tới 107 bàn thắng sau 38 vòng đấu.',
      },
      {
        date: 'Mùa 1989/90',
        event:
          'Hugo Sánchez ghi 38 bàn thắng tại La Liga (100% đều từ những pha dứt điểm một chạm!) để đoạt Chiếc giày vàng châu Âu.',
      },
    ],
    milestonesEn: [
      {
        date: '1978–1980',
        event:
          'Three consecutive La Liga titles (1978–1980) and the 1979/80 domestic double following Santiago Bernabéu’s passing.',
      },
      {
        date: '11/12/1985 & 1985–1986',
        event:
          'Epic 4–0 Remontada against Borussia Mönchengladbach (overturning a 1–5 deficit) and back-to-back UEFA Cup titles (1985, 1986).',
      },
      {
        date: '1986–1990',
        event:
          'La Quinta del Buitre wins 5 straight La Liga championships, smashing the league record with 107 goals in 1989/90.',
      },
      {
        date: '1989/90 Season',
        event:
          'Hugo Sánchez scores 38 La Liga goals — every single one with a first-time touch — to win the European Golden Shoe.',
      },
    ],
    tacticalFormationVi: '4-4-2 Tấn công tổng lực giàu kỹ thuật & chồng biên tốc độ cao',
    tacticalFormationEn: 'High-tempo Technical 4-4-2 with overlapping wing play',
    leadershipVi: 'Chủ tịch: Santiago Bernabéu, Luis de Carlos, Ramón Mendoza | HLV: Miljan Miljanić, Vujadin Boškov, Leo Beenhakker, John Toshack',
    leadershipEn: 'Presidents: Luis de Carlos, Ramón Mendoza | Managers: Miljan Miljanić, Leo Beenhakker, John Toshack',
    iconicMatchVi: 'Real Madrid 4–0 Borussia Mönchengladbach (11/12/1985 — Lội ngược dòng sau khi thua 1–5 lượt đi)',
    iconicMatchEn: 'Real Madrid 4–0 Borussia Mönchengladbach (11/12/1985 — Historic UEFA Cup Remontada)',
    recordsVi: [
      'Chuỗi 121 trận bất bại liên tiếp trên sân nhà Santiago Bernabéu tại La Liga (1957–1965) & 5 La Liga liên tiếp (1986–1990)',
      'Kỷ lục 107 bàn thắng trong một mùa giải La Liga 38 vòng dưới thời HLV John Toshack (1989/90)',
      'Hugo Sánchez giành 4 danh hiệu Vua phá lưới Pichichi liên tiếp cùng Real Madrid',
    ],
    recordsEn: [
      '5 consecutive La Liga championships (1986–1990)',
      '107 goals in a 38-match La Liga season under John Toshack (1989/90)',
      'Hugo Sánchez won 4 consecutive Pichichi trophies at Real Madrid',
    ],
    icons: ['Emilio Butragueño', 'Hugo Sánchez', 'Santillana', 'Juanito', 'Manolo Sanchís', 'Fernando Hierro'],
  },
  {
    id: 'era-4',
    period: '1991–2006',
    titleVi: '4. La Séptima Sau 32 Năm Chờ Đợi & Dải Ngân Hà Galácticos 1.0 (3 Cúp C1: 1998, 2000, 2002)',
    titleEn: '4. La Séptima After 32 Years & The Galácticos 1.0 Era (1998, 2000, 2002 UCL)',
    trophiesWon: 14,
    contextVi:
      'Ngày 29/10/1994, chàng trai 17 tuổi Raúl González ra mắt đội một, mở ra thời kỳ phục hưng tại đấu trường châu lục. Ngày 20/05/1998 tại Amsterdam, bàn thắng của Predrag Mijatović vào lưới Juventus đã chấm dứt cơn khát 32 năm chờ đợi để mang về La Séptima (Cúp C1 thứ 7). Năm 2000, sau khi đoàn quân của HLV Vicente del Bosque giành La Octava tại Paris, tỷ phú Florentino Pérez đắc cử Chủ tịch và kích hoạt chiến lược "Zidanes y Pavones" (Galácticos 1.0), quy tụ Luís Figo, Zinedine Zidane, Ronaldo Nazário, David Beckham bên cạnh Raúl, Roberto Carlos, Iker Casillas và chạm đỉnh với cú vô-lê La Novena (2002) tại Glasgow.',
    contextEn:
      'Following the 1994 debut of 17-year-old Raúl González, Real Madrid ended a 32-year wait for the European Cup on May 20, 1998 (La Séptima vs Juventus) and added La Octava in 2000 under Vicente del Bosque. President Florentino Pérez then launched the Galácticos 1.0 era (Figo, Zidane, Ronaldo Nazário, Beckham), crowned by Zidane’s immortal left-footed volley to win La Novena in Glasgow (2002).',
    milestonesVi: [
      {
        date: '20/05/1998',
        event:
          'La Séptima tại Amsterdam Arena: Đánh bại Juventus 1–0 nhờ pha lập công phút 66 của Mijatović, giải cơn khát Cúp C1 kéo dài 32 năm (1966–1998).',
      },
      {
        date: '24/05/2000',
        event:
          'La Octava tại Stade de France (Paris): Đè bẹp Valencia 3–0 trong trận Chung kết C1 nội bộ Tây Ban Nha đầu tiên (Morientes, McManaman, Raúl ghi bàn).',
      },
      {
        date: '15/05/2002',
        event:
          'La Novena tại Hampden Park (Glasgow): Zinedine Zidane tung cú bắt vô-lê chân trái bất tử từ đường tạt của Roberto Carlos và Iker Casillas cản phá xuất thần cuối trận giúp thắng Bayer Leverkusen 2–1.',
      },
      {
        date: '11/12/2000',
        event:
          'FIFA chính thức trao tặng Real Madrid danh hiệu cao quý "Câu Lạc Bộ Vĩ Đại Nhất Thế Kỷ 20" (FIFA Club of the 20th Century) với 42.35% phiếu bầu toàn cầu.',
      },
    ],
    milestonesEn: [
      {
        date: '20/05/1998',
        event:
          'La Séptima in Amsterdam: 1–0 victory over Juventus ends a 32-year European Cup drought.',
      },
      {
        date: '24/05/2000',
        event:
          'La Octava in Paris: Dominant 3–0 triumph over Valencia (goals by Morientes, McManaman, and Raúl).',
      },
      {
        date: '15/05/2002',
        event:
          'La Novena in Glasgow: Zidane’s iconic left-footed volley and Casillas’s late saves seal a 2–1 win over Bayer Leverkusen.',
      },
      {
        date: '11/12/2000',
        event:
          'FIFA officially crowns Real Madrid as the "FIFA Club of the 20th Century".',
      },
    ],
    tacticalFormationVi: '4-2-3-1 / 4-4-2 Lệch trái (Makélélé mỏ neo, Zidane tự do lệch trái mở hành lang cho Roberto Carlos băng lên)',
    tacticalFormationEn: 'Asymmetric 4-2-3-1 / 4-4-2 (Makélélé pivot, Zidane free role, Roberto Carlos overlapping left flank)',
    leadershipVi: 'Chủ tịch: Lorenzo Sanz, Florentino Pérez | HLV: Jupp Heynckes, Vicente del Bosque, Carlos Queiroz',
    leadershipEn: 'Presidents: Lorenzo Sanz, Florentino Pérez | Managers: Jupp Heynckes, Vicente del Bosque',
    iconicMatchVi: 'Real Madrid 2–1 Bayer Leverkusen (15/05/2002 — Chung kết C1 La Novena với siêu phẩm vô-lê của Zidane)',
    iconicMatchEn: 'Real Madrid 2–1 Bayer Leverkusen (15/05/2002 — La Novena UCL Final in Glasgow)',
    recordsVi: [
      '3 chức vô địch UEFA Champions League trong vòng 5 mùa giải (1998, 2000, 2002)',
      'Iker Casillas trở thành thủ môn trẻ nhất lịch sử đá chính và vô địch Chung kết C1 (19 tuổi 4 ngày năm 2000)',
      'Raúl González lập kỷ lục 741 trận ra sân và 323 bàn thắng trước kỷ nguyên Cristiano Ronaldo',
    ],
    recordsEn: [
      '3 UEFA Champions League titles in 5 seasons (1998, 2000, 2002)',
      'Iker Casillas became the youngest goalkeeper to start and win a UCL Final (19 years, 4 days in 2000)',
      'Raúl González set the club record of 741 appearances and 323 goals',
    ],
    icons: ['Raúl González', 'Zinedine Zidane', 'Ronaldo Nazário', 'Roberto Carlos', 'Iker Casillas', 'Luís Figo', 'David Beckham'],
  },
  {
    id: 'era-5',
    period: '2007–2018',
    titleVi: '5. Kỷ Nguyên Cristiano Ronaldo, La Liga 100 Điểm, La Décima 92:48 & Cú Ăn 3 C1 Lịch Sử',
    titleEn: '5. Cristiano Ronaldo, 100-Point Liga, La Décima 92:48 & The Historic UCL Three-Peat',
    trophiesWon: 20,
    contextVi:
      'Mùa hè 2009, Florentino Pérez trở lại ghế Chủ tịch và thực hiện kỳ chuyển nhượng vĩ đại nhất lịch sử khi đưa về Cristiano Ronaldo (trước 80.000 khán giả chật kín Bernabéu), Karim Benzema, Xabi Alonso và Kaká. Dưới thời HLV José Mourinho, Real Madrid lập kỷ lục "La Liga de los Récords" mùa 2011/12 (100 điểm, 121 bàn thắng). Ngày 24/05/2014 tại Lisbon, cú đánh đầu phút 92:48 của Sergio Ramos cùng HLV Carlo Ancelotti đã mở toang cánh cửa La Décima. Tiếp đó, HLV Zinedine Zidane cùng bộ ba BBC (Bale – Benzema – Cristiano) và tam giác tuyến giữa CMK (Casemiro – Modrić – Kroos) đã lập kỳ tích vô địch Champions League 3 mùa liên tiếp (2016, 2017, 2018).',
    contextEn:
      'In summer 2009, Florentino Pérez signed Cristiano Ronaldo, Karim Benzema, and Xabi Alonso. After José Mourinho’s record-shattering 2011/12 La Liga (100 points, 121 goals), Sergio Ramos’s 92:48 header under Carlo Ancelotti in Lisbon delivered La Décima (2014). Manager Zinedine Zidane then guided the BBC trident and CMK midfield to an unprecedented Champions League Three-Peat (2016, 2017, 2018).',
    milestonesVi: [
      {
        date: '06/07/2009 & Mùa 2011/12',
        event:
          '80.000 CĐV đón Cristiano Ronaldo tại Bernabéu; mùa 2011/12 lập kỷ lục La Liga mọi thời đại với 100 điểm và 121 bàn thắng.',
      },
      {
        date: '24/05/2014 (Phút 92:48)',
        event:
          'La Décima tại Lisbon: Từ quả phạt góc của Luka Modrić ở phút 92:48, Sergio Ramos đánh đầu gỡ hòa 1–1 trước khi Bale, Marcelo, Ronaldo ghi bàn thắng chung cuộc 4–1 trước Atlético Madrid.',
      },
      {
        date: '28/05/2016 & 03/06/2017',
        event:
          'La Undécima tại Milan (thắng Atlético 5–3 pen) và La Duodécima tại Cardiff (hủy diệt Juventus 4–1 với sơ đồ 4-3-1-2 Kim cương, trở thành CLB đầu tiên bảo vệ thành công C1).',
      },
      {
        date: '26/05/2018',
        event:
          'La Decimotercera tại Kyiv: Đánh bại Liverpool 3–1 với cú đúp của Gareth Bale (bao gồm siêu phẩm xe đạp chổng ngược vĩ đại nhất lịch sử Chung kết C1), hoàn tất 4 Cúp C1 trong 5 năm.',
      },
    ],
    milestonesEn: [
      {
        date: '06/07/2009 & 2011/12',
        event:
          '80,000 fans welcome Cristiano Ronaldo; 2011/12 "La Liga de los Récords" achieves 100 points and 121 goals.',
      },
      {
        date: '24/05/2014 (Minute 92:48)',
        event:
          'La Décima in Lisbon: Sergio Ramos’s 92:48 header from Modrić’s corner sparks a 4–1 extra-time triumph over Atlético Madrid.',
      },
      {
        date: '28/05/2016 & 03/06/2017',
        event:
          'La Undécima in Milan and La Duodécima in Cardiff (4–1 vs Juventus), making Madrid the first club to retain the modern UCL.',
      },
      {
        date: '26/05/2018',
        event:
          'La Decimotercera in Kyiv: 3–1 win over Liverpool featuring Gareth Bale’s overhead kick completes the 2016–2018 UCL Three-Peat.',
      },
    ],
    tacticalFormationVi: '4-3-3 Chuyển trạng thái siêu tốc (BBC + CMK) & 4-3-1-2 Kim cương kiểm soát không gian (Isco hộ công)',
    tacticalFormationEn: '4-3-3 High-Velocity Transition (BBC + CMK) & 4-3-1-2 Midfield Diamond (Isco #10)',
    leadershipVi: 'Chủ tịch: Florentino Pérez | HLV: José Mourinho, Carlo Ancelotti, Zinedine Zidane',
    leadershipEn: 'President: Florentino Pérez | Managers: José Mourinho, Carlo Ancelotti, Zinedine Zidane',
    iconicMatchVi: 'Real Madrid 4–1 Juventus (03/06/2017 — Chung kết C1 Cardiff) & Real Madrid 4–1 Atlético Madrid (24/05/2014 — La Décima 92:48)',
    iconicMatchEn: 'Real Madrid 4–1 Juventus (2017 Cardiff Final) & Real Madrid 4–1 Atlético Madrid (2014 La Décima)',
    recordsVi: [
      'CLB duy nhất trong kỷ nguyên UEFA Champions League vô địch 3 mùa liên tiếp (2015/16, 2016/17, 2017/18) và thắng 100% (12/12) cặp đấu knock-out',
      'Cristiano Ronaldo ghi 450 bàn thắng sau 438 trận (hiệu suất 1.03 bàn/trận) và lập kỷ lục 17 bàn trong 1 mùa C1 (2013/14)',
      'Kỷ lục 100 điểm & 121 bàn thắng tại La Liga 2011/12; chuỗi 40 trận bất bại liên tiếp trên mọi đấu trường (2016/17)',
    ],
    recordsEn: [
      'Only club in the modern UEFA Champions League era to win 3 consecutive titles (2016–2018)',
      'Cristiano Ronaldo scored 450 goals in 438 matches (1.03 goals/game) and a record 17 UCL goals in 2013/14',
      'All-time La Liga records of 100 points and 121 goals (2011/12) + 40-match unbeaten streak (2016/17)',
    ],
    icons: ['Cristiano Ronaldo', 'Sergio Ramos', 'Luka Modrić', 'Toni Kroos', 'Karim Benzema', 'Gareth Bale', 'Marcelo', 'Casemiro'],
  },
  {
    id: 'era-6',
    period: '2019–2024',
    titleVi: '6. DNA Ngược Dòng Kỳ Diệu (La Decimocuarta 2022) & Chiến Dịch Bất Bại La Decimoquinta 2024',
    titleEn: '6. Miracle Knock-Out Remontadas (2022) & Unbeaten La Decimoquinta (2024)',
    trophiesWon: 14,
    contextVi:
      'Giai đoạn chuyển giao thế hệ mẫu mực bậc nhất lịch sử bóng đá dưới bàn tay của Carlo Ancelotti và Zinedine Zidane: kết hợp những lão tướng từng 6 lần vô địch C1 (Modrić, Kroos, Carvajal, Nacho) với dàn sao trẻ Vinícius Júnior, Rodrygo, Valverde, Camavinga, Bellingham và đôi găng vàng Thibaut Courtois. Mùa 2021/22, Real Madrid tạo nên hành trình Champions League kỳ vĩ nhất mọi thời đại khi lội ngược dòng ở những phút cuối trước PSG, Chelsea, Man City (cú đúp 89.9’ & 90+1’ của Rodrygo khi xác suất đi tiếp chỉ còn 1%) trước khi hạ Liverpool 1–0 tại Paris. Mùa 2023/24, CLB đăng quang Cúp C1 thứ 15 (La Decimoquinta) tại Wembley với thành tích bất bại suốt cả giải đấu.',
    contextEn:
      'A masterclass in generational transition blending veterans (Modrić, Kroos, Carvajal, Nacho, Benzema, Courtois) with rising stars (Vinícius Jr., Rodrygo, Valverde, Bellingham). In 2021/22, Madrid staged impossible late knock-out comebacks against PSG, Chelsea, and Man City (1% win probability at minute 89) to win their 14th UCL, followed by an unbeaten 2023/24 campaign to lift the 15th UCL (La Decimoquinta) at Wembley.',
    milestonesVi: [
      {
        date: '09/03 – 04/05/2022',
        event:
          'Chuỗi 3 đêm Remontada chấn động tại Bernabéu: Benzema lập hat-trick trong 17 phút hạ PSG (3–1), Modrić vẩy má ngoài kiến tạo cho Rodrygo hạ Chelsea, và Rodrygo ghi 2 bàn trong 90 giây (90’ & 90+1’) đánh gục Man City 3–1.',
      },
      {
        date: '28/05/2022 (La Decimocuarta)',
        event:
          'Chung kết C1 tại Paris: Vinícius Júnior ghi bàn duy nhất và Thibaut Courtois thực hiện kỷ lục 9 pha cứu thua giúp Real Madrid thắng Liverpool 1–0.',
      },
      {
        date: '08/05/2024',
        event:
          'Bán kết lượt về C1 tại Bernabéu: Siêu dự bị Joselu ghi cú đúp ở phút 88 và 90+1 lội ngược dòng thắng Bayern Munich 2–1.',
      },
      {
        date: '01/06/2024 (La Decimoquinta)',
        event:
          'Chung kết C1 tại Wembley: Dani Carvajal và Vinícius Júnior lập công hạ Borussia Dortmund 2–0, lần đầu tiên trong lịch sử CLB vô địch C1 với thành tích bất bại (9 thắng, 4 hòa).',
      },
    ],
    milestonesEn: [
      {
        date: '09/03 – 04/05/2022',
        event:
          'Three consecutive Bernabéu knock-out Remontadas against PSG, Chelsea, and Manchester City (Rodrygo’s 90’ & 90+1’ brace).',
      },
      {
        date: '28/05/2022 (La Decimocuarta)',
        event:
          'Paris UCL Final: Vinícius Jr. scores and Thibaut Courtois makes a record 9 saves to defeat Liverpool 1–0.',
      },
      {
        date: '08/05/2024',
        event:
          'Joselu’s 88’ & 90+1’ brace overturns Bayern Munich 2–1 at the Bernabéu.',
      },
      {
        date: '01/06/2024 (La Decimoquinta)',
        event:
          'Wembley UCL Final: Carvajal and Vinícius Jr. score to beat Dortmund 2–0, completing Madrid’s first-ever unbeaten Champions League campaign.',
      },
    ],
    tacticalFormationVi: '4-3-3 Linh hoạt & 4-4-2 Kim cương (Jude Bellingham đóng vai trò False 9 / Hộ công xâm nhập vòng cấm)',
    tacticalFormationEn: 'Fluid 4-3-3 & 4-4-2 Diamond with Jude Bellingham as box-crashing #10',
    leadershipVi: 'Chủ tịch: Florentino Pérez | HLV: Zinedine Zidane, Carlo Ancelotti (HLV giàu thành tích nhất lịch sử CLB với 15 danh hiệu)',
    leadershipEn: 'President: Florentino Pérez | Managers: Zinedine Zidane, Carlo Ancelotti (15 trophies)',
    iconicMatchVi: 'Real Madrid 3–1 Manchester City (04/05/2022 — Bán kết lượt về C1, lội ngược dòng từ 1% xác suất ở phút 89)',
    iconicMatchEn: 'Real Madrid 3–1 Manchester City (04/05/2022 — UCL Semi-Final 2nd Leg Miracle)',
    recordsVi: [
      'Cán mốc 15 chức vô địch C1 / Champions League — gấp hơn 2 lần đội xếp thứ hai tại châu Âu (AC Milan, 7 cúp)',
      'Luka Modrić (28 danh hiệu), Dani Carvajal (27), Nacho (26) và Toni Kroos cùng đạt kỷ lục 6 chức vô địch Champions League',
      'Thibaut Courtois lập kỷ lục 9 pha cứu thua trong một trận Chung kết Champions League (2022)',
    ],
    recordsEn: [
      'Reached 15 UEFA Champions League titles — more than double any other club in Europe',
      'Modrić, Kroos, Carvajal, and Nacho matched Paco Gento’s all-time record of 6 European Cups',
      'Thibaut Courtois set the all-time UCL Final record with 9 saves against Liverpool (2022)',
    ],
    icons: ['Karim Benzema', 'Luka Modrić', 'Toni Kroos', 'Vinícius Júnior', 'Thibaut Courtois', 'Jude Bellingham', 'Federico Valverde'],
  },
  {
    id: 'era-7',
    period: '2024–2026/27',
    titleVi: '7. Kỷ Nguyên Neo-Galácticos 3.0, New Bernabéu 360° & Tam Tấu BMV (Mbappé × Vini × Bellingham)',
    titleEn: '7. Neo-Galácticos 3.0, New Bernabéu 360° & The BMV Trident (Mbappé × Vini × Bellingham)',
    trophiesWon: 5,
    contextVi:
      'Mùa hè 2024–2026 đánh dấu sự ra đời của đế chế Neo-Galácticos 3.0 bên trong Siêu thánh đường công nghệ cao New Bernabéu 360°. Sự hội tụ của bộ ba trung tâm Tam tấu BMV gồm Kylian Mbappé (#10), Vinícius Júnior (#7) và Jude Bellingham (#5), sát cánh cùng Federico Valverde (#8), Aurélien Tchouaméni (#14), Eduardo Camavinga (#6), Arda Güler (#15), Dean Huijsen (#4) và tài năng trẻ chạy cánh Yan Diomande đã tạo nên hệ thống tấn công toàn diện bậc nhất thế giới — khẳng định bản lĩnh bằng chiến thắng El Clásico 2–1 ngay trên sân Camp Nou của Barcelona ngày 26/10/2026 với cú đúp của Kylian Mbappé (41’, 87’ — Cột mốc 100 bàn cho Real Madrid).',
    contextEn:
      'Inside the completed futuristic New Bernabéu 360°, the Neo-Galácticos 3.0 era is anchored by the central BMV Trident of Kylian Mbappé (#10), Vinícius Jr. (#7), and Jude Bellingham (#5), alongside Federico Valverde (#8), Aurélien Tchouaméni (#14), Eduardo Camavinga (#6), Arda Güler (#15), Dean Huijsen (#4), and young Ivorian winger Yan Diomande, highlighted by the 2–1 El Clásico away victory over Barcelona at Camp Nou on October 26, 2026 via Kylian Mbappé’s heroic brace (41’, 87’ — 100th Real Madrid goal).',
    milestonesVi: [
      {
        date: '14/08/2024 & 18/12/2024',
        event:
          'Kylian Mbappé ghi bàn ngay trong trận ra mắt (do Jude Bellingham kiến tạo) giúp Real Madrid vô địch Siêu cúp châu Âu thứ 6 (thắng Atalanta 2–0) và FIFA Intercontinental Cup 2024 (thắng Pachuca 3–0).',
      },
      {
        date: 'Mùa giải 2024–2026/27',
        event:
          'Bộ ba trung tâm Tam tấu BMV gồm Kylian Mbappé (#10 — 118 trận, 100 bàn, 18 kiến tạo), Vinícius Júnior (#7 — 381 trận, 118 bàn, 98 kiến tạo) và Jude Bellingham (#5 — 153 trận, 49 bàn, 36 kiến tạo) định hình lối chơi chuyển trạng thái tốc độ cao.',
      },
      {
        date: '26/10/2026',
        event:
          "Barcelona 1–2 Real Madrid tại Camp Nou (Mbappé 41', 87' — Cột mốc 100 bàn cho Real Madrid & san bằng kỷ lục 59 bàn/năm dương lịch của Cristiano Ronaldo; Raphinha 61'). Kiến tạo bàn ấn định 2–1 phút 87': Eduardo Camavinga (#6). Thủ môn Andriy Lunin (#13) bắt chính cản phá 4 cú sút. Đội hình xuất phát Real Madrid theo realmadrid.com: 13. Lunin; 8. Valverde (61' Dumfries), 16. Konaté, 4. Huijsen, 17. Cucurella; 14. Tchouaméni, 20. Bernardo Silva (79' Camavinga), 5. Bellingham; 25. Yan Diomande (90+3' Carlos Espí), 15. Arda Güler (90+3' Trent), 10. Mbappé.",
      },
      {
        date: '2026/27',
        event:
          'Tam tấu BMV — Bellingham (#5), Mbappé (#10) và Vinícius Jr. (#7) — đạt hiệu suất đóng góp tổng hợp 2.35 G+A/90 phút, dẫn đầu châu Âu về chỉ số kỳ vọng bàn thắng và kiến tạo.',
      },
    ],
    milestonesEn: [
      {
        date: '14/08/2024 & 18/12/2024',
        event:
          'Kylian Mbappé scores on debut (assisted by Jude Bellingham) to win a record 6th UEFA Super Cup (2–0 vs Atalanta) followed by the 2024 FIFA Intercontinental Cup.',
      },
      {
        date: '2024–2026/27 Seasons',
        event:
          'The central BMV Trident of Kylian Mbappé (#10 — 118 apps, 100G, 18A), Vinícius Jr. (#7 — 381 apps, 118G, 98A), and Jude Bellingham (#5 — 153 apps, 49G, 36A) anchors Madrid’s attack.',
      },
      {
        date: '26/10/2026',
        event:
          "Barcelona 1–2 Real Madrid at Camp Nou (Mbappé 41', 87' — 100th official goal for Real Madrid & equaling Cristiano Ronaldo’s record of 59 goals in a calendar year; Raphinha 61'). 87' winning assist: Eduardo Camavinga (#6). Official Real Madrid XI per realmadrid.com: 13. Lunin; 8. Valverde (61' Dumfries), 16. Konaté, 4. Huijsen, 17. Cucurella; 14. Tchouaméni, 20. Bernardo Silva (79' Camavinga), 5. Bellingham; 25. Yan Diomande (90+3' Carlos Espí), 15. Arda Güler (90+3' Trent), 10. Mbappé.",
      },
      {
        date: '2026/27',
        event:
          'The BMV Trident — Bellingham (#5), Mbappé (#10), and Vinícius Jr. (#7) — records a combined 2.35 G+A per 90 minutes at the heart of Real Madrid’s attack.',
      },
    ],
    tacticalFormationVi: '4-3-3 Linh hoạt / 4-2-3-1 Kim cương (Jude Bellingham #5 nhạc trưởng hộ công kết nối trực tiếp với Mbappé #10 & Vinícius Jr. #7)',
    tacticalFormationEn: 'Fluid 4-3-3 / Asymmetric 4-2-3-1 with Jude Bellingham (#5) orchestrating behind Mbappé (#10) & Vinícius Jr. (#7)',
    leadershipVi: 'Chủ tịch: Florentino Pérez | Ban huấn luyện Kỷ nguyên 2024–2026/27 (Carlo Ancelotti & José Mourinho)',
    leadershipEn: 'President: Florentino Pérez | 2024–2026/27 Technical Leadership (Carlo Ancelotti & José Mourinho)',
    iconicMatchVi: "FC Barcelona 1–2 Real Madrid (26/10/2026 tại Camp Nou — Mbappé 41', 87' cán mốc 100 bàn | Raphinha 61')",
    iconicMatchEn: "FC Barcelona 1–2 Real Madrid (26/10/2026 at Camp Nou — Mbappé 41', 87' 100th goal | Raphinha 61')",
    recordsVi: [
      'CLB bóng đá đầu tiên trong lịch sử cán mốc doanh thu hơn 1.045 tỷ Euro/năm nhờ tổ hợp New Bernabéu 360°',
      'Kylian Mbappé (#10) cán mốc 100 bàn thắng chính thức cho Real Madrid sau 118 trận & san bằng kỷ lục 59 bàn/năm dương lịch của Cristiano Ronaldo',
      'Tam tấu BMV (#5 Bellingham, #10 Mbappé, #7 Vinícius Jr.) đạt tổng hiệu suất 2.35 G+A/90 phút và nâng số trận thắng El Clásico lên 107 trận',
    ],
    recordsEn: [
      'First football club in history to surpass €1.045 billion in annual operating revenue',
      'Kylian Mbappé (#10) reaches 100 official goals for Real Madrid in 118 matches & equals Cristiano Ronaldo’s record of 59 goals in a calendar year',
      'The BMV Trident (#5 Bellingham, #10 Mbappé, #7 Vinícius Jr.) combines for 2.35 G+A per 90 minutes alongside 107 all-time official El Clásico victories',
    ],
    icons: ['Kylian Mbappé', 'Vinícius Júnior', 'Jude Bellingham', 'Federico Valverde', 'Thibaut Courtois', 'Trent Alexander-Arnold', 'Yan Diomande'],
  },
];

interface BernabeuEvolutionStage {
  id: string;
  stepNumber: string;
  year: string;
  nameVi: string;
  nameEn: string;
  capacity: string;
  costVi: string;
  costEn: string;
  architectsVi: string;
  architectsEn: string;
  techSpecsVi: string[];
  techSpecsEn: string[];
  historicEventVi: string;
  historicEventEn: string;
}

const BERNABEU_7_STAGES: BernabeuEvolutionStage[] = [
  {
    id: 'stage-1',
    stepNumber: '01',
    year: '1912–1923',
    nameVi: "Campo de O'Donnell",
    nameEn: "Campo de O'Donnell",
    capacity: '5.000',
    costVi: '6.000 Pesetas (do Chủ tịch Pedro Parages & các hội viên đóng góp)',
    costEn: '6,000 Pesetas (funded by Pedro Parages & club members)',
    architectsVi: 'Kỹ sư công trình đô thị Madrid & tình nguyện viên CLB (cầu thủ Santiago Bernabéu trực tiếp sơn hàng rào)',
    architectsEn: 'Madrid Municipal Engineers & Club Volunteers (young Santiago Bernabéu helped paint the wooden fence)',
    techSpecsVi: [
      'Sân vận động đầu tiên tại Tây Ban Nha lắp đặt hàng rào gỗ cao ngăn cách mặt sân thi đấu với khán giả đứng xem',
      'Mặt sân kích thước 115m × 85m kèm khu vực khán đài danh dự Tribuna có mái che cho 216 khách quý',
      'Cho phép CLB bán vé cố định để tự chủ tài chính lần đầu tiên trong lịch sử',
    ],
    techSpecsEn: [
      'First pitch in Spain featuring a wooden perimeter fence separating spectators from the playing field',
      '115m × 85m pitch with a covered 216-seat Tribuna de Honor',
      'Enabled structured ticket sales and financial autonomy for the club',
    ],
    historicEventVi: 'Khánh thành ngày 31/10/1912 gặp Sporting de Irún và là nơi Real Madrid vô địch Copa del Rey 1917.',
    historicEventEn: 'Inaugurated on October 31, 1912 vs Sporting de Irún; hosted the 1917 Copa del Rey triumph.',
  },
  {
    id: 'stage-2',
    stepNumber: '02',
    year: '1923–1924',
    nameVi: 'Campo de Ciudad Lineal (Velódromo)',
    nameEn: 'Campo de Ciudad Lineal (Velódromo)',
    capacity: '8.000',
    costVi: 'Thuê và cải tạo từ trường đua xe đạp của kiến trúc sư Arturo Soria',
    costEn: 'Leased and adapted from Arturo Soria’s velodrome complex',
    architectsVi: 'Arturo Soria y Mata (Quy hoạch đô thị Ciudad Lineal)',
    architectsEn: 'Arturo Soria y Mata (Ciudad Lineal Urban Planner)',
    techSpecsVi: [
      'Sân vận động đầu tiên của Real Madrid sở hữu mặt cỏ tự nhiên 100% (thay thế hoàn toàn mặt sân đất nện)',
      'Tích hợp đường đua lòng chảo bao quanh mặt sân cỏ tiêu chuẩn quốc tế',
      'Bước đệm kỹ thuật quan trọng trước khi CLB hoàn tất xây dựng thánh địa riêng tại Chamartín',
    ],
    techSpecsEn: [
      'Real Madrid’s very first stadium featuring a 100% natural grass playing surface',
      'Surrounded by a banked cycling velodrome track',
      'Transitional home while the club constructed its own stadium in Chamartín',
    ],
    historicEventVi: 'Khánh thành ngày 29/04/1923 (Real Madrid thắng Real Unión de Irún 2–0 với cú đúp của José María Úbeda).',
    historicEventEn: 'Inaugurated on April 29, 1923 with a 2–0 victory over Real Unión de Irún.',
  },
  {
    id: 'stage-3',
    stepNumber: '03',
    year: '1924–1947',
    nameVi: 'Estadio Viejo Chamartín',
    nameEn: 'Estadio Viejo Chamartín',
    capacity: '22.500',
    costVi: '1.142.500 Pesetas (mua khu đất "Villa Rosa" rộng 40.000 m² và xây dựng)',
    costEn: '1,142,500 Pesetas (acquisition of 40,000 m² "Villa Rosa" estate & construction)',
    architectsVi: 'KTS José María Castell (cựu cầu thủ kiêm kiến trúc sư trưởng của CLB)',
    architectsEn: 'José María Castell (former Real Madrid player & lead architect)',
    techSpecsVi: [
      'Khán đài chính có mái che chứa 4.000 ghế gỗ kiểu Anh cổ điển cùng tổ hợp thể thao (sân quần vợt, hồ bơi, phòng tập)',
      'Sức chứa 22.500 khán giả, giúp Real Madrid đón lượng khán giả gấp 3 lần thập niên trước',
      'Trải qua đợt trùng tu lớn năm 1939 sau Nội chiến Tây Ban Nha trước khi quá tải vào thập niên 1940',
    ],
    techSpecsEn: [
      'Covered British-style main grandstand seating 4,000 spectators plus swimming pool and tennis courts',
      '22,500 total capacity, tripling the club’s previous matchday attendance',
      'Rebuilt in 1939 after the Spanish Civil War',
    ],
    historicEventVi: 'Khánh thành ngày 17/05/1924 bằng chiến thắng 3–2 trước nhà vô địch FA Cup Anh Newcastle United; chứng kiến 2 chức vô địch La Liga đầu tiên (1932, 1933).',
    historicEventEn: 'Inaugurated on May 17, 1924 by defeating English FA Cup holders Newcastle United 3–2; hosted the 1932 & 1933 La Liga titles.',
  },
  {
    id: 'stage-4',
    stepNumber: '04',
    year: '1947–1954',
    nameVi: 'Nuevo Chamartín / Santiago Bernabéu',
    nameEn: 'Nuevo Chamartín / Santiago Bernabéu',
    capacity: '75.145',
    costVi: '38.940.916 Pesetas (huy động qua phát hành trái phiếu cho các hội viên Socios trong 24 giờ)',
    costEn: '38,940,916 Pesetas (raised via Socios club bonds within 24 hours)',
    architectsVi: 'KTS Manuel Muñoz Monasterio & KTS Luis Alemany Soler',
    architectsEn: 'Manuel Muñoz Monasterio & Luis Alemany Soler',
    techSpecsVi: [
      'Kết cấu bê tông cốt thép 2 tầng khán đài khép kín (27.645 chỗ ngồi và 47.500 chỗ đứng), quy mô hiện đại nhất châu Âu hậu Thế chiến II',
      'Đường hầm cầu thủ kết nối trực tiếp phòng thay đồ dưới lòng đất với khu vực giữa sân',
      'Ngày 04/01/1955, Đại hội đồng Socios nhất trí 100% đổi tên sân thành Estadio Santiago Bernabéu để vinh danh vị Chủ tịch kiến tạo',
    ],
    techSpecsEn: [
      'Reinforced concrete two-tier bowl holding 75,145 spectators (27,645 seated, 47,500 standing)',
      'Direct underground players’ tunnel and modern drainage engineering',
      'Officially renamed Estadio Santiago Bernabéu on January 4, 1955 by unanimous vote of the Socios',
    ],
    historicEventVi: 'Khánh thành ngày 14/12/1947 (Real Madrid thắng Os Belenenses của Bồ Đào Nha 3–1, Sabino Barinaga ghi bàn thắng đầu tiên).',
    historicEventEn: 'Inaugurated on December 14, 1947 with a 3–1 win over Os Belenenses (Sabino Barinaga scored the stadium’s first-ever goal).',
  },
  {
    id: 'stage-5',
    stepNumber: '05',
    year: '1954–1980',
    nameVi: 'Đại Mở Rộng Colosseum 125.000 Chỗ',
    nameEn: 'The 125,000-Capacity European Colosseum',
    capacity: '125.000',
    costVi: '12.000.000+ Pesetas (giai đoạn mở rộng tầng 3 & lắp đặt tháp đèn pha 1957)',
    costEn: '12,000,000+ Pesetas (3rd-tier amphitheater & 1957 floodlight towers)',
    architectsVi: 'KTS Luis Alemany Soler & KTS Manuel Muñoz Monasterio',
    architectsEn: 'Luis Alemany Soler & Manuel Muñoz Monasterio',
    techSpecsVi: [
      'Khánh thành tầng khán đài thứ 3 (Anfiteatro) ngày 19/06/1954, nâng tổng sức chứa lên 125.000 khán giả — lớn thứ hai châu Âu',
      'Hai tháp trụ kiến trúc đặc trưng mặt tiền phía Tây và hệ thống đèn pha chiếu sáng ban đêm tối tân lắp đặt ngày 18/05/1957 (cường độ 1.500 lux)',
      'Phục vụ những đêm Cúp C1 châu Âu rực lửa của thế hệ Di Stéfano, Puskás, Gento',
    ],
    techSpecsEn: [
      'Added the massive third-tier amphitheater on June 19, 1954 to reach 125,000 capacity',
      'Installed Europe’s most powerful night floodlight system on May 18, 1957 (1,500 lux) for midweek European Cup nights',
      'Became the fortress of the 5-peat European Cup dynasty',
    ],
    historicEventVi: 'Đăng cai Chung kết Cúp C1 châu Âu năm 1957 (Real Madrid 2–0 Fiorentina trước 124.000 khán giả), Chung kết EURO 1964 và Chung kết C1 1969, 1980.',
    historicEventEn: 'Hosted the 1957 European Cup Final (Real Madrid 2–0 Fiorentina in front of 124,000 fans), the 1964 EURO Final, and the 1969 & 1980 European Cup Finals.',
  },
  {
    id: 'stage-6',
    stepNumber: '06',
    year: '1982–2018',
    nameVi: 'Cải Tạo World Cup 1982 & Hiện Đại Hóa Thiên Niên Kỷ',
    nameEn: '1982 World Cup Remodel & Millennium 5-Star Modernization',
    capacity: '81.044',
    costVi: '704 triệu Pesetas (1982) + 247 triệu Euro (Dự án Hiện đại hóa Thế kỷ 21 giai đoạn 2001–2011 của Florentino Pérez)',
    costEn: '704M Pesetas (1982) + €247M (Florentino Pérez’s 2001–2011 Master Plan)',
    architectsVi: 'KTS Rafael Luis Alemany & Manuel Salinas (1982) | Estudio Lamela (1992–2011)',
    architectsEn: 'Rafael Luis Alemany & Manuel Salinas (1982) | Estudio Lamela (1992–2011)',
    techSpecsVi: [
      'Cải tạo phục vụ World Cup 1982: lắp mái che kim loại bao phủ 3/4 chu vi khán đài và hệ thống bảng điện tử màu Mitsubishi/Sony đầu tiên',
      'Năm 1992–1998: Xây dựng 4 tháp cầu thang xoắn ốc ở 4 góc sân và chuyển đổi 100% vị trí đứng thành ghế ngồi tiêu chuẩn an toàn UEFA',
      'Năm 2001–2007: Mở rộng khán đài phía Đông (Calle Padre Damián), lắp hệ thống hơn 1.300 máy sưởi hồng ngoại khán đài, phòng VIP Hospitality và Bảo tàng Tour Bernabéu; được UEFA trao chuẩn "Sân vận động 5 Sao / Elite" năm 2007',
    ],
    techSpecsEn: [
      '1982 World Cup upgrade added a metallic roof covering three of the four grandstands and Sony/Mitsubishi video scoreboards',
      '1992–1998 expansion added the four iconic corner access towers and converted the stadium to an 81,044 all-seater venue',
      '2001–2007 Master Plan added the East Stand facade, 1,300+ infrared stadium heaters, VIP skyboxes, and earned UEFA 5-Star Elite status in 2007',
    ],
    historicEventVi: 'Tổ chức trận Chung kết World Cup 1982 (Ý 3–1 Tây Đức) và trận Chung kết UEFA Champions League 2010.',
    historicEventEn: 'Hosted the 1982 FIFA World Cup Final (Italy 3–1 West Germany) and the 2010 UEFA Champions League Final.',
  },
  {
    id: 'stage-7',
    stepNumber: '07',
    year: '2019–2026',
    nameVi: 'Siêu Thánh Đường Công Nghệ Cao Thế Kỷ 21 (New Bernabéu 360°)',
    nameEn: '21st-Century Futuristic Megastructure (New Bernabéu 360°)',
    capacity: '83.186',
    costVi: '~1.76 tỷ Euro (tài trợ dài hạn lãi suất cố định, mang lại >1.045 tỷ Euro doanh thu/năm cho CLB)',
    costEn: '~€1.76 Billion (generating €1.045B+ in annual club revenue)',
    architectsVi: 'GMP Architekten (Đức) • L35 Architects • Ribas & Ribas (Kỹ thuật kết cấu: Ines Ingenieros & SBP)',
    architectsEn: 'GMP Architekten • L35 Architects • Ribas & Ribas (Structural Engineering: SBP)',
    techSpecsVi: [
      'Lớp vỏ thép không gỉ uốn lượn phản quang (Wrap-around Titanium/Stainless Steel Louvers) cho phép trình chiếu ánh sáng nghệ thuật lên bề mặt sân vận động',
      'Mái vòm đóng/mở tự động hoàn toàn trong đúng 15 phút (Retractable Roof) bằng hệ thống cáp treo siêu trường siêu trọng dài 176m',
      'Màn hình Halo LED 360 độ (3.700 m² diện tích hiển thị độ phân giải 8K HDR) chạy liền mạch quanh vòm mái cùng tầng khán đài mới thứ 5',
      'Hầm ngầm bảo quản mặt cỏ 6 tầng sâu 30 mét dưới lòng đất (Hypogeum / Cueva): toàn bộ mặt sân cỏ được chia thành 6 tấm khay khổng lồ trượt xuống lòng đất trong vài giờ, tích hợp hệ thống tưới nước tự động, đèn quang hợp tia UV, thông gió oxy và điều hòa nhiệt độ để tổ chức NFL, NBA, hòa nhạc quốc tế 365 ngày/năm mà không làm hỏng mặt cỏ',
    ],
    techSpecsEn: [
      'Sculptural wrap-around stainless steel facade capable of dynamic LED architectural projection',
      'Fully retractable roof opening or closing in exactly 15 minutes across a 176-meter span',
      '360-degree Halo LED Video Scoreboard (3,700 m² of seamless high-definition screens)',
      '6-Story, 30-Meter Deep Underground Pitch Hypogeum: splits the hybrid grass pitch into 6 mechanized trays stored underground with automated UV lighting, irrigation, ventilation, and climate control for 365-day multi-event operations',
    ],
    historicEventVi: 'Nơi chứng kiến màn ngược dòng hạ Bayern Munich 2–1 (Bán kết C1 2024), siêu sự kiện NFL Madrid Game, và là đại bản doanh của thế hệ Neo-Galácticos 3.0 vừa đánh bại Barca 2–1 ngay tại Camp Nou ngày 26/10/2026 (Mbappé 41’, 88’).',
    historicEventEn: 'Hosted the 2024 UCL Semi-Final comeback vs Bayern Munich, the historic NFL Madrid Game, and serves as the fortress of the Neo-Galácticos 3.0 squad that conquered Camp Nou 2–1 on October 26, 2026 (Mbappé 41’, 88’).',
  },
];

export const TimelineSection: React.FC<TimelineSectionProps> = ({ lang }) => {
  const [activeEraId, setActiveEraId] = useState<string>('era-7');
  const [activeStadiumIdx, setActiveStadiumIdx] = useState<number>(6);

  const selectedEra = DEEP_ERAS.find((e) => e.id === activeEraId) ?? DEEP_ERAS[6];
  const selectedStage = BERNABEU_7_STAGES[activeStadiumIdx] ?? BERNABEU_7_STAGES[6];

  return (
    <section id="timeline" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-semibold uppercase tracking-widest mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi'
                ? 'Phân Hệ 1 • Bách Khoa Toàn Thư Lịch Sử & Kiến Trúc'
                : 'Module 1 • Historical & Architectural Encyclopedia'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'vi'
              ? 'DÒNG THỜI GIAN CHUYÊN SÂU (1902–2026) & TIẾN HÓA SANTIAGO BERNABÉU'
              : 'DEEP-DIVE TIMELINE (1902–2026) & SANTIAGO BERNABÉU EVOLUTION'}
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-xl">
          {lang === 'vi'
            ? 'Toàn bộ 7 kỷ nguyên vàng son với cột mốc ngày/tháng/năm chi tiết, sơ đồ chiến thuật, lãnh đạo, kỷ lục cùng 7 giai đoạn tiến hóa kiến trúc của thánh đường Bernabéu.'
            : 'Explore all 7 golden eras with dated milestones, tactical blueprints, records, and the 7-stage architectural metamorphosis of Estadio Santiago Bernabéu.'}
        </p>
      </div>

      {/* 7 Eras Interactive Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
        {DEEP_ERAS.map((era, idx) => {
          const isSelected = era.id === selectedEra.id;
          return (
            <button
              key={era.id}
              onClick={() => setActiveEraId(era.id)}
              className={`royal-card-hover group text-left p-3.5 rounded-xl border ${
                isSelected
                  ? 'bg-gradient-to-br from-[#D4AF37]/25 via-[#16203D] to-[#0D1326] border-[#F5D061] shadow-[0_0_25px_rgba(212,175,55,0.22)] -translate-y-0.5'
                  : 'bg-[#0D1326]/80 border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#16203D]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold text-[#F5D061] whitespace-nowrap">
                  {era.period}
                </span>
                <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  0{idx + 1}
                </span>
              </div>
              <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                {(lang === 'vi' ? era.titleVi : era.titleEn).replace(/^\d+\.\s*/, '')}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#D4AF37]">
                <Trophy className="w-3 h-3" />
                <span>
                  {era.trophiesWon} {lang === 'vi' ? 'danh hiệu' : 'trophies'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Era Deep Encyclopedia Panel */}
      <div
        key={selectedEra.id}
        className="glass-royal animate-section-reveal rounded-2xl p-6 sm:p-8 mb-14 relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Context + Dated Chronological Milestones + Era Icons */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#D4AF37] text-[#060913] text-xs font-extrabold">
                <Crown className="w-3.5 h-3.5" />
                <span>{selectedEra.period}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16203D] border border-[#D4AF37]/40 text-[#F5D061] text-xs font-extrabold">
                <Trophy className="w-3.5 h-3.5" />
                <span>
                  +{selectedEra.trophiesWon}{' '}
                  {lang === 'vi' ? 'Danh Hiệu Chính Thức' : 'Official Trophies'}
                </span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {lang === 'vi' ? selectedEra.titleVi : selectedEra.titleEn}
            </h3>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              {lang === 'vi' ? selectedEra.contextVi : selectedEra.contextEn}
            </p>

            {/* Chronological Dated Milestones */}
            <div className="bg-[#060913]/85 rounded-2xl p-5 border border-[#D4AF37]/30 space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#F5D061] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {lang === 'vi'
                    ? 'Cột Mốc Ngày / Tháng / Năm Lịch Sử:'
                    : 'Key Chronological Milestones:'}
                </span>
              </div>
              <div className="space-y-3">
                {(lang === 'vi' ? selectedEra.milestonesVi : selectedEra.milestonesEn).map(
                  (m, idx) => (
                    <div
                      key={idx}
                      style={{ '--stagger-delay': `${idx * 45}ms` } as React.CSSProperties}
                      className="animate-card-stagger flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3 pb-2.5 border-b border-white/10 last:border-b-0 last:pb-0"
                    >
                      <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5D061] text-xs font-extrabold whitespace-nowrap shrink-0">
                        {m.date}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{m.event}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Era Icons */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {lang === 'vi'
                    ? 'Huyền Thoại & Ngôi Sao Biểu Tượng Kỷ Nguyên:'
                    : 'Era Icons & Key Figures:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedEra.icons.map((icon) => (
                  <span
                    key={icon}
                    className="px-3 py-1 rounded-lg bg-[#16203D] border border-[#D4AF37]/35 text-xs font-bold text-[#F5D061]"
                  >
                    {icon}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right 5 Cols: 4 Auxiliary Encyclopedia Sub-Cards (Tactics, Leadership, Iconic Match, Records) */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* Card 1: Tactical Formation */}
            <div
              style={{ '--stagger-delay': '40ms' } as React.CSSProperties}
              className="animate-card-stagger bg-[#060913]/85 rounded-xl p-4 border border-[#D4AF37]/30"
            >
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#F5D061] mb-1.5 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>
                  {lang === 'vi'
                    ? 'Sơ Đồ & Triết Lý Chiến Thuật Đặc Trưng'
                    : 'Signature Tactical Blueprint'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                {lang === 'vi'
                  ? selectedEra.tacticalFormationVi
                  : selectedEra.tacticalFormationEn}
              </p>
            </div>

            {/* Card 2: Presidents & Managers */}
            <div
              style={{ '--stagger-delay': '90ms' } as React.CSSProperties}
              className="animate-card-stagger bg-[#060913]/85 rounded-xl p-4 border border-[#D4AF37]/30"
            >
              <div className="text-xs font-extrabold uppercase tracking-wider text-sky-400 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>
                  {lang === 'vi'
                    ? 'Chủ Tịch & Huấn Luyện Viên Dẫn Dắt'
                    : 'Presidents & Iconic Managers'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed">
                {lang === 'vi' ? selectedEra.leadershipVi : selectedEra.leadershipEn}
              </p>
            </div>

            {/* Card 3: Most Iconic Match */}
            <div
              style={{ '--stagger-delay': '140ms' } as React.CSSProperties}
              className="animate-card-stagger bg-[#060913]/85 rounded-xl p-4 border border-[#D4AF37]/30"
            >
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                <Swords className="w-4 h-4" />
                <span>
                  {lang === 'vi' ? 'Trận Đấu Biểu Tượng Nhất Kỷ Nguyên' : 'Most Iconic Match'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                {lang === 'vi' ? selectedEra.iconicMatchVi : selectedEra.iconicMatchEn}
              </p>
            </div>

            {/* Card 4: Record Numbers & Total Trophies */}
            <div
              style={{ '--stagger-delay': '190ms' } as React.CSSProperties}
              className="animate-card-stagger bg-[#060913]/85 rounded-xl p-4 border border-[#D4AF37]/30"
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#F5D061] flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>
                    {lang === 'vi'
                      ? 'Những Con Số Kỷ Lục & Thành Tựu'
                      : 'Era Records & Achievements'}
                  </span>
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#D4AF37] text-[#060913] text-xs font-black">
                  +{selectedEra.trophiesWon} 🏆
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {(lang === 'vi' ? selectedEra.recordsVi : selectedEra.recordsEn).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#F5D061] font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
         PART 2: ARCHITECTURAL EVOLUTION OF ESTADIO SANTIAGO BERNABÉU (1912–2026)
         ======================================================================== */}
      <div className="bg-[#0D1326]/90 rounded-2xl border border-[#D4AF37]/40 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#F5D061] mb-1">
              <Landmark className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? 'Hồ Sơ Kiến Trúc & Kỹ Thuật Công Trình (7 Giai Đoạn Phát Triển)'
                  : 'Architectural & Engineering Dossier (7 Evolutionary Stages)'}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#F5D061] shrink-0" />
              <span>
                {lang === 'vi'
                  ? 'TIẾN HÓA KIẾN TRÚC THÁNH ĐƯỜNG SANTIAGO BERNABÉU (1912–2026)'
                  : 'ARCHITECTURAL EVOLUTION OF ESTADIO SANTIAGO BERNABÉU (1912–2026)'}
              </span>
            </h3>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#16203D] border border-[#D4AF37]/50 text-xs font-extrabold text-[#F5D061] whitespace-nowrap self-start lg:self-auto">
            {lang === 'vi' ? 'Đang xem:' : 'Viewing:'} {selectedStage.year} •{' '}
            {selectedStage.capacity} {lang === 'vi' ? 'chỗ' : 'seats'}
          </div>
        </div>

        {/* 7 Stage Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
          {BERNABEU_7_STAGES.map((stage, i) => {
            const active = activeStadiumIdx === i;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStadiumIdx(i)}
                className={`royal-card-hover p-3 rounded-xl border text-left ${
                  active
                    ? 'bg-gradient-to-br from-[#D4AF37]/25 via-[#16203D] to-[#0D1326] border-[#F5D061] shadow-lg -translate-y-0.5'
                    : 'bg-[#060913]/65 border-white/10 hover:border-[#D4AF37]/45'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-extrabold text-[#F5D061] whitespace-nowrap">
                    {stage.year}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">#{stage.stepNumber}</span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {lang === 'vi' ? stage.nameVi : stage.nameEn}
                </div>
                <div className="text-[11px] font-extrabold text-emerald-400 mt-1.5">
                  {stage.capacity} {lang === 'vi' ? 'chỗ' : 'cap'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Technical & Historical Blueprint */}
        <div
          key={selectedStage.id}
          className="animate-section-reveal grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Left 5 Cols: Key Architectural KPIs (Capacity, Cost, Architects, Historic Event) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="bg-[#060913]/90 rounded-2xl p-5 border border-[#D4AF37]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-[#F5D061]">
                    {lang === 'vi'
                      ? `Giai đoạn ${selectedStage.stepNumber} • ${selectedStage.year}`
                      : `Stage ${selectedStage.stepNumber} • ${selectedStage.year}`}
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">
                    {lang === 'vi' ? selectedStage.nameVi : selectedStage.nameEn}
                  </h4>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {lang === 'vi' ? 'Sức chứa' : 'Capacity'}
                  </div>
                  <div className="text-2xl font-black text-[#F5D061]">{selectedStage.capacity}</div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-extrabold uppercase text-slate-400 mb-0.5">
                    {lang === 'vi' ? '💰 Chi Phí Xây Dựng & Đầu Tư:' : '💰 Construction & Investment Cost:'}
                  </div>
                  <div className="font-bold text-emerald-400 text-xs sm:text-sm">
                    {lang === 'vi' ? selectedStage.costVi : selectedStage.costEn}
                  </div>
                </div>

                <div>
                  <div className="font-extrabold uppercase text-slate-400 mb-0.5">
                    {lang === 'vi' ? '📐 Kiến Trúc Sư & Đơn Vị Thiết Kế:' : '📐 Lead Architects & Engineers:'}
                  </div>
                  <div className="font-semibold text-white text-xs sm:text-sm">
                    {lang === 'vi' ? selectedStage.architectsVi : selectedStage.architectsEn}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="font-extrabold uppercase text-[#F5D061] mb-1">
                    {lang === 'vi' ? '🏆 Sự Kiện Lịch Sử Tiêu Biểu:' : '🏆 Landmark Historical Events:'}
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {lang === 'vi' ? selectedStage.historicEventVi : selectedStage.historicEventEn}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Detailed Engineering & Technological Specifications */}
          <div className="lg:col-span-7 bg-[#060913]/90 rounded-2xl p-5 sm:p-6 border border-[#D4AF37]/30 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#F5D061]">
              <Wrench className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? 'Đặc Điểm Công Nghệ, Kết Cấu & Đột Phá Kiến Trúc:'
                  : 'Technological Features & Structural Engineering:'}
              </span>
            </div>

            <div className="space-y-3">
              {(lang === 'vi' ? selectedStage.techSpecsVi : selectedStage.techSpecsEn).map(
                (spec, idx) => (
                  <div
                    key={idx}
                    style={{ '--stagger-delay': `${idx * 55}ms` } as React.CSSProperties}
                    className="animate-card-stagger flex items-start gap-3 p-3.5 rounded-xl bg-[#0D1326] border border-white/10"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#D4AF37] text-[#060913] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {spec}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Extra Highlight Banner for Stage 7 (New Bernabéu 360° Hypogeum & Halo LED) */}
            {selectedStage.id === 'stage-7' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#16203D] border border-[#D4AF37]/40 text-center">
                  <div className="text-[10px] font-bold uppercase text-slate-300">
                    {lang === 'vi' ? 'Mái Vòm Tự Động' : 'Retractable Roof'}
                  </div>
                  <div className="text-base font-black text-[#F5D061] mt-0.5">
                    15 {lang === 'vi' ? 'Phút' : 'Mins'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#16203D] border border-[#D4AF37]/40 text-center">
                  <div className="text-[10px] font-bold uppercase text-slate-300">
                    {lang === 'vi' ? 'Màn Hình Halo LED' : 'Halo LED Scoreboard'}
                  </div>
                  <div className="text-base font-black text-sky-400 mt-0.5">360° • 3.700 m²</div>
                </div>
                <div className="p-3 rounded-xl bg-[#16203D] border border-[#D4AF37]/40 text-center">
                  <div className="text-[10px] font-bold uppercase text-slate-300">
                    {lang === 'vi' ? 'Hầm Cỏ Ngầm Hypogeum' : 'Underground Hypogeum'}
                  </div>
                  <div className="text-base font-black text-emerald-400 mt-0.5">
                    6 {lang === 'vi' ? 'Tầng • Sâu 30m' : 'Levels • 30m Deep'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
