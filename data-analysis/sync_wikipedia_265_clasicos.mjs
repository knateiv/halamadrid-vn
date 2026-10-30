import fs from 'node:fs';

const WIKI_URL =
  'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_El_Cl%C3%A1sico_matches&prop=wikitext&format=json';
const CACHE_PATH = 'D:/halamadrid-vn/data-analysis/wiki_el_clasico.txt';
const JSON_PATH = 'D:/halamadrid-vn/frontend/src/data/madrid_analytics.json';

// Remove old Python script if present
try {
  if (fs.existsSync('D:/halamadrid-vn/data-analysis/generate_265_clasicos.py')) {
    fs.unlinkSync('D:/halamadrid-vn/data-analysis/generate_265_clasicos.py');
  }
  if (fs.existsSync('D:/halamadrid-vn/data-analysis/test_parse_wiki.mjs')) {
    fs.unlinkSync('D:/halamadrid-vn/data-analysis/test_parse_wiki.mjs');
  }
} catch {}

let wikitext = '';
if (fs.existsSync(CACHE_PATH)) {
  wikitext = fs.readFileSync(CACHE_PATH, 'utf8');
} else {
  const res = await fetch(WIKI_URL, {
    headers: { 'User-Agent': 'HalaMadridVN-DataAudit/2.6 (https://realmadrid.com)' },
  });
  const data = await res.json();
  wikitext = data?.parse?.wikitext?.['*'] || '';
  fs.writeFileSync(CACHE_PATH, wikitext, 'utf8');
}

function cleanWikiText(raw) {
  if (!raw) return '';
  return raw
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<ref[^/]*\/>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\{\{colored link\|[^|]+\|[^|]+\|([^}]+)\}\}/gi, '$1')
    .replace(/\{\{aet\}\}/gi, '(a.e.t.)')
    .replace(/\{\{nowrap\|([\s\S]*?)\}\}/gi, '$1')
    .replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1')
    .replace(/'''/g, '')
    .replace(/''/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripCellStyle(cell) {
  const trimmed = cell.trim();
  const idx = trimmed.indexOf('|');
  if (idx !== -1) {
    const prefix = trimmed.slice(0, idx);
    if (
      /style=|width=|align=|rowspan=|colspan=|class=/i.test(prefix) &&
      !prefix.includes('[[')
    ) {
      return trimmed.slice(idx + 1).trim();
    }
  }
  return trimmed;
}

function extractSectionTable(sectionHeader) {
  const startIdx = wikitext.indexOf(sectionHeader);
  if (startIdx === -1) throw new Error(`Missing section ${sectionHeader}`);
  const tableStart = wikitext.indexOf('{|', startIdx);
  const tableEnd = wikitext.indexOf('|}', tableStart);
  return wikitext.slice(tableStart, tableEnd + 2);
}

function splitRowCells(rowBlock) {
  const lines = rowBlock.split(/\r?\n/);
  const contentLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (i === 0 && lines[i].trim().startsWith('|-')) continue;
    const l = lines[i].trim();
    if (!l || l.startsWith('!')) continue;
    contentLines.push(l);
  }
  const joined = contentLines.join('\n');
  let protectedStr = '';
  let depthBracket = 0;
  let depthBrace = 0;
  for (let i = 0; i < joined.length; i++) {
    const ch = joined[i];
    const next = joined[i + 1];
    if (ch === '[' && next === '[') {
      depthBracket++;
      protectedStr += '[[';
      i++;
      continue;
    }
    if (ch === ']' && next === ']') {
      depthBracket = Math.max(0, depthBracket - 1);
      protectedStr += ']]';
      i++;
      continue;
    }
    if (ch === '{' && next === '{') {
      depthBrace++;
      protectedStr += '{{';
      i++;
      continue;
    }
    if (ch === '}' && next === '}') {
      depthBrace = Math.max(0, depthBrace - 1);
      protectedStr += '}}';
      i++;
      continue;
    }
    if (depthBracket === 0 && depthBrace === 0) {
      if (ch === '|' && next === '|') {
        protectedStr += '\u0000CELL\u0000';
        i++;
        continue;
      }
      if (ch === '|' && (i === 0 || joined[i - 1] === '\n')) {
        protectedStr += '\u0000CELL\u0000';
        continue;
      }
    }
    protectedStr += ch;
  }
  return protectedStr
    .split('\u0000CELL\u0000')
    .slice(1)
    .map((c) => c.trim());
}

const MONTHS = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};

function parseEnglishDateToDDMMYYYY(dStr) {
  const m = dStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!m) throw new Error(`Cannot parse date: ${dStr}`);
  const day = m[1].padStart(2, '0');
  const mon = MONTHS[m[2]];
  const year = m[3];
  if (!mon) throw new Error(`Unknown month in ${dStr}`);
  return `${day}/${mon}/${year}`;
}

function normalizeSeason(s) {
  const clean = s.replace('–', '/').replace('-', '/').trim();
  if (/^\d{4}\/\d{2}$/.test(clean)) return clean;
  if (/^\d{4}$/.test(clean)) {
    const y = Number(clean);
    return `${y - 1}/${String(y).slice(-2)}`;
  }
  return clean;
}

// 1. Parse Primera División (193 matches)
const ligaTable = extractSectionTable('===Primera División matches===');
const ligaRows = ligaTable.split(/\r?\n\|-/).slice(1);
const ligaMatches = [];
for (const r of ligaRows) {
  const rawCells = splitRowCells('|- ' + r);
  if (rawCells.length < 6) continue;
  const cells = rawCells.map(stripCellStyle);
  const no = cleanWikiText(cells[0]);
  const rawDate = cells[1];
  const dateClean = cleanWikiText(rawDate);
  const seasonMatch = rawDate.match(/\[\[([^|\]]+)\s+La Liga/i);
  let season = seasonMatch ? normalizeSeason(seasonMatch[1]) : '';
  const mw = cleanWikiText(cells[2]);
  const home = cleanWikiText(cells[3]);
  const away = cleanWikiText(cells[4]);
  const scoreRaw = cleanWikiText(cells[5]);
  const scoreMatch = scoreRaw.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (!scoreMatch) continue;
  const homeGoals = Number(scoreMatch[1]);
  const awayGoals = Number(scoreMatch[2]);
  const goalsHome = cleanWikiText(cells[6] || '');
  const goalsAway = cleanWikiText(cells[7] || '');

  let dateDDMMYYYY = parseEnglishDateToDDMMYYYY(dateClean);
  // Align latest 2026/27 & 2025/26 match dates with Spain/VN official match report dates
  if (Number(no) === 193 && dateDDMMYYYY === '25/10/2026') {
    dateDDMMYYYY = '26/10/2026';
  }
  if (Number(no) === 192 && dateDDMMYYYY === '10/05/2026') {
    dateDDMMYYYY = '11/05/2026';
  }

  const yearNum = Number(dateDDMMYYYY.slice(-4));
  let venue = '';
  if (home.includes('Real Madrid')) {
    venue = yearNum < 1948 ? 'Estadio Chamartín' : yearNum === 2021 ? 'Alfredo Di Stéfano' : 'Santiago Bernabéu';
  } else {
    venue =
      yearNum < 1957
        ? 'Camp de Les Corts'
        : season === '2023/24' || season === '2024/25'
        ? 'Olímpic Lluís Companys'
        : 'Camp Nou';
  }

  ligaMatches.push({
    compGroup: 'La Liga',
    season,
    date: dateDDMMYYYY,
    competition: `La Liga ${season} (Vòng ${mw})`,
    venue,
    home,
    away,
    homeGoals,
    awayGoals,
    extraTime: false,
    goalsHome,
    goalsAway,
  });
}

// Helper for stateful rowspan Cup tables
function parseCupTable(sectionHeader, compGroup, hasTwoRoundCols) {
  const tbl = extractSectionTable(sectionHeader);
  const rows = tbl.split(/\r?\n\|-/).slice(1);
  const result = [];
  let activeSeason = '';
  let seasonRemaining = 0;
  let activeRound = '';
  let roundRemaining = 0;

  for (const r of rows) {
    const rawCells = splitRowCells('|- ' + r);
    if (rawCells.length < 4) continue;
    let idx = 0;

    let season = '';
    if (seasonRemaining > 0) {
      season = activeSeason;
      seasonRemaining--;
    } else {
      const c = rawCells[idx++];
      const rs = c.match(/rowspan\s*=\s*"?(\d+)"?/i);
      season = cleanWikiText(stripCellStyle(c));
      if (rs) {
        activeSeason = season;
        seasonRemaining = Number(rs[1]) - 1;
      }
    }

    let round1 = '';
    let round2 = '';
    if (hasTwoRoundCols) {
      if (roundRemaining > 0) {
        round1 = activeRound;
        roundRemaining--;
        round2 = cleanWikiText(stripCellStyle(rawCells[idx++]));
      } else {
        const c = rawCells[idx++];
        const rs = c.match(/rowspan\s*=\s*"?(\d+)"?/i);
        const cs = c.match(/colspan\s*=\s*"?(\d+)"?/i);
        round1 = cleanWikiText(stripCellStyle(c));
        if (rs) {
          activeRound = round1;
          roundRemaining = Number(rs[1]) - 1;
        }
        if (!cs) {
          round2 = cleanWikiText(stripCellStyle(rawCells[idx++]));
        }
      }
    } else {
      round1 = cleanWikiText(stripCellStyle(rawCells[idx++]));
    }

    const home = cleanWikiText(stripCellStyle(rawCells[idx++] || ''));
    const away = cleanWikiText(stripCellStyle(rawCells[idx++] || ''));
    const scoreCell = cleanWikiText(stripCellStyle(rawCells[idx++] || ''));
    const scoreMatch = scoreCell.match(/(\d+)\s*[–-]\s*(\d+)/);
    if (!scoreMatch) continue;
    const homeGoals = Number(scoreMatch[1]);
    const awayGoals = Number(scoreMatch[2]);
    const extraTime = /a\.e\.t\./i.test(scoreCell);
    const goalsHome = cleanWikiText(stripCellStyle(rawCells[idx++] || ''));
    const goalsAway = cleanWikiText(stripCellStyle(rawCells[idx++] || ''));

    result.push({
      compGroup,
      season: normalizeSeason(season),
      round1,
      round2,
      extraTime,
      home,
      away,
      homeGoals,
      awayGoals,
      goalsHome,
      goalsAway,
    });
  }
  return result;
}

// Exact historical dates & venues for the 38 Copa del Rey matches
const COPA_DEL_REY_META = [
  ['26/03/1916', 'Bán kết lượt đi Cúp Nhà Vua 1916', 'Camp de la Indústria'],
  ['02/04/1916', 'Bán kết lượt về Cúp Nhà Vua 1916', "Campo de O'Donnell"],
  ['13/04/1916', 'Bán kết đá lại (Lần 1) Cúp Nhà Vua 1916', "Campo de O'Donnell"],
  ['15/04/1916', 'Bán kết đá lại (Lần 2) Cúp Nhà Vua 1916', "Campo de O'Donnell"],
  ['18/04/1926', 'Tứ kết lượt đi Cúp Nhà Vua 1926', 'Estadio Chamartín'],
  ['25/04/1926', 'Tứ kết lượt về Cúp Nhà Vua 1926', 'Camp de Les Corts'],
  ['21/06/1936', 'Chung kết Cúp Nhà Vua 1936', 'Mestalla (Valencia)'],
  ['06/06/1943', 'Bán kết lượt đi Cúp Nhà Vua 1943', 'Camp de Les Corts'],
  ['13/06/1943', 'Bán kết lượt về Cúp Nhà Vua 1943', 'Estadio Chamartín'],
  ['06/06/1954', 'Bán kết lượt đi Cúp Nhà Vua 1954', 'Nuevo Chamartín'],
  ['13/06/1954', 'Bán kết lượt về Cúp Nhà Vua 1954', 'Camp de Les Corts'],
  ['12/05/1957', 'Tứ kết lượt đi Cúp Nhà Vua 1957', 'Santiago Bernabéu'],
  ['19/05/1957', 'Tứ kết lượt về Cúp Nhà Vua 1957', 'Camp de Les Corts'],
  ['07/06/1959', 'Bán kết lượt đi Cúp Nhà Vua 1958/59', 'Santiago Bernabéu'],
  ['14/06/1959', 'Bán kết lượt về Cúp Nhà Vua 1958/59', 'Camp Nou'],
  ['15/04/1962', 'Tứ kết lượt đi Cúp Nhà Vua 1961/62', 'Santiago Bernabéu'],
  ['22/04/1962', 'Tứ kết lượt về Cúp Nhà Vua 1961/62', 'Camp Nou'],
  ['11/07/1968', 'Chung kết Cúp Nhà Vua 1967/68', 'Santiago Bernabéu'],
  ['30/05/1970', 'Tứ kết lượt đi Cúp Nhà Vua 1969/70', 'Santiago Bernabéu'],
  ['06/06/1970', 'Tứ kết lượt về Cúp Nhà Vua 1969/70', 'Camp Nou'],
  ['29/06/1974', 'Chung kết Cúp Nhà Vua 1973/74', 'Vicente Calderón (Madrid)'],
  ['04/06/1983', 'Chung kết Cúp Nhà Vua 1982/83', 'La Romareda (Zaragoza)'],
  ['05/04/1990', 'Chung kết Cúp Nhà Vua 1989/90', 'Mestalla (Valencia)'],
  ['09/06/1993', 'Bán kết lượt đi Cúp Nhà Vua 1992/93', 'Santiago Bernabéu'],
  ['16/06/1993', 'Bán kết lượt về Cúp Nhà Vua 1992/93', 'Camp Nou'],
  ['30/01/1997', 'Vòng 1/8 lượt đi Cúp Nhà Vua 1996/97', 'Camp Nou'],
  ['06/02/1997', 'Vòng 1/8 lượt về Cúp Nhà Vua 1996/97', 'Santiago Bernabéu'],
  ['20/04/2011', 'Chung kết Cúp Nhà Vua 2010/11', 'Mestalla (Valencia)'],
  ['18/01/2012', 'Tứ kết lượt đi Cúp Nhà Vua 2011/12', 'Santiago Bernabéu'],
  ['25/01/2012', 'Tứ kết lượt về Cúp Nhà Vua 2011/12', 'Camp Nou'],
  ['30/01/2013', 'Bán kết lượt đi Cúp Nhà Vua 2012/13', 'Santiago Bernabéu'],
  ['26/02/2013', 'Bán kết lượt về Cúp Nhà Vua 2012/13', 'Camp Nou'],
  ['16/04/2014', 'Chung kết Cúp Nhà Vua 2013/14', 'Mestalla (Valencia)'],
  ['06/02/2019', 'Bán kết lượt đi Cúp Nhà Vua 2018/19', 'Camp Nou'],
  ['27/02/2019', 'Bán kết lượt về Cúp Nhà Vua 2018/19', 'Santiago Bernabéu'],
  ['02/03/2023', 'Bán kết lượt đi Cúp Nhà Vua 2022/23', 'Santiago Bernabéu'],
  ['05/04/2023', 'Bán kết lượt về Cúp Nhà Vua 2022/23', 'Camp Nou'],
  ['26/04/2025', 'Chung kết Cúp Nhà Vua 2024/25', 'La Cartuja (Seville)'],
];

// Exact historical dates & venues for the 19 Supercopa de España matches
const SUPERCOPA_META = [
  ['21/09/1988', 'Siêu Cúp Tây Ban Nha 1988 (Lượt đi)', 'Santiago Bernabéu'],
  ['29/09/1988', 'Siêu Cúp Tây Ban Nha 1988 (Lượt về)', 'Camp Nou'],
  ['05/12/1990', 'Siêu Cúp Tây Ban Nha 1990 (Lượt đi)', 'Camp Nou'],
  ['12/12/1990', 'Siêu Cúp Tây Ban Nha 1990 (Lượt về)', 'Santiago Bernabéu'],
  ['02/12/1993', 'Siêu Cúp Tây Ban Nha 1993 (Lượt đi)', 'Santiago Bernabéu'],
  ['16/12/1993', 'Siêu Cúp Tây Ban Nha 1993 (Lượt về)', 'Camp Nou'],
  ['20/08/1997', 'Siêu Cúp Tây Ban Nha 1997 (Lượt đi)', 'Camp Nou'],
  ['23/08/1997', 'Siêu Cúp Tây Ban Nha 1997 (Lượt về)', 'Santiago Bernabéu'],
  ['14/08/2011', 'Siêu Cúp Tây Ban Nha 2011 (Lượt đi)', 'Santiago Bernabéu'],
  ['17/08/2011', 'Siêu Cúp Tây Ban Nha 2011 (Lượt về)', 'Camp Nou'],
  ['23/08/2012', 'Siêu Cúp Tây Ban Nha 2012 (Lượt đi)', 'Camp Nou'],
  ['29/08/2012', 'Siêu Cúp Tây Ban Nha 2012 (Lượt về)', 'Santiago Bernabéu'],
  ['13/08/2017', 'Siêu Cúp Tây Ban Nha 2017 (Lượt đi)', 'Camp Nou'],
  ['16/08/2017', 'Siêu Cúp Tây Ban Nha 2017 (Lượt về)', 'Santiago Bernabéu'],
  ['12/01/2022', 'Bán kết Siêu Cúp Tây Ban Nha 2022', 'King Fahd Stadium (Riyadh)'],
  ['15/01/2023', 'Chung kết Siêu Cúp Tây Ban Nha 2023', 'King Fahd Stadium (Riyadh)'],
  ['14/01/2024', 'Chung kết Siêu Cúp Tây Ban Nha 2024', 'Al-Awwal Park (Riyadh)'],
  ['12/01/2025', 'Chung kết Siêu Cúp Tây Ban Nha 2025', 'King Abdullah Sports City (Jeddah)'],
  ['12/01/2026', 'Chung kết Siêu Cúp Tây Ban Nha 2026', 'King Abdullah Sports City (Jeddah)'],
];

// Exact historical dates & venues for the 8 UEFA Champions League matches
const UCL_META = [
  ['21/04/1960', 'Bán kết lượt đi Cúp C1 1959/60', 'Santiago Bernabéu'],
  ['27/04/1960', 'Bán kết lượt về Cúp C1 1959/60', 'Camp Nou'],
  ['09/11/1960', 'Vòng 1 lượt đi Cúp C1 1960/61', 'Santiago Bernabéu'],
  ['23/11/1960', 'Vòng 1 lượt về Cúp C1 1960/61', 'Camp Nou'],
  ['23/04/2002', 'Bán kết lượt đi Champions League 2001/02', 'Camp Nou'],
  ['01/05/2002', 'Bán kết lượt về Champions League 2001/02', 'Santiago Bernabéu'],
  ['27/04/2011', 'Bán kết lượt đi Champions League 2010/11', 'Santiago Bernabéu'],
  ['03/05/2011', 'Bán kết lượt về Champions League 2010/11', 'Camp Nou'],
];

// Exact historical dates & venues for the 6 Copa de la Liga matches
const COPA_LIGA_META = [
  ['26/06/1983', 'Chung kết lượt đi Copa de la Liga 1983', 'Santiago Bernabéu'],
  ['29/06/1983', 'Chung kết lượt về Copa de la Liga 1983', 'Camp Nou'],
  ['11/05/1985', 'Tứ kết lượt đi Copa de la Liga 1985', 'Camp Nou'],
  ['16/05/1985', 'Tứ kết lượt về Copa de la Liga 1985', 'Santiago Bernabéu'],
  ['11/05/1986', 'Vòng 2 lượt đi Copa de la Liga 1986', 'Camp Nou'],
  ['18/05/1986', 'Vòng 2 lượt về Copa de la Liga 1986', 'Santiago Bernabéu'],
];

const copaRaw = parseCupTable('===Copa del Rey matches===', 'Copa del Rey', true);
const supercopaRaw = parseCupTable('===Supercopa de España matches===', 'Supercopa de España', false);
const uclRaw = parseCupTable('===UEFA Champions League matches===', 'UEFA Champions League', true);
const copaLigaRaw = parseCupTable('===Copa de la Liga matches===', 'Copa de la Liga', true);

const copaMatches = copaRaw.map((m, idx) => ({
  ...m,
  date: COPA_DEL_REY_META[idx][0],
  competition: COPA_DEL_REY_META[idx][1],
  venue: COPA_DEL_REY_META[idx][2],
}));

const supercopaMatches = supercopaRaw.map((m, idx) => ({
  ...m,
  date: SUPERCOPA_META[idx][0],
  competition: SUPERCOPA_META[idx][1],
  venue: SUPERCOPA_META[idx][2],
}));

const uclMatches = uclRaw.map((m, idx) => ({
  ...m,
  date: UCL_META[idx][0],
  competition: UCL_META[idx][1],
  venue: UCL_META[idx][2],
}));

const copaLigaMatches = copaLigaRaw.map((m, idx) => ({
  ...m,
  date: COPA_LIGA_META[idx][0],
  competition: COPA_LIGA_META[idx][1],
  venue: COPA_LIGA_META[idx][2],
}));

// Copa de la Coronación (1 match)
const coronacionTable = extractSectionTable('===Copa de la Coronación===');
const coronacionRows = coronacionTable.split(/\r?\n\|-/).slice(1);
const coronacionMatches = [];
for (const r of coronacionRows) {
  const rawCells = splitRowCells('|- ' + r);
  if (rawCells.length < 6) continue;
  const cells = rawCells.map(stripCellStyle);
  const dateClean = cleanWikiText(cells[0]);
  const home = cleanWikiText(cells[3]);
  const away = cleanWikiText(cells[4]);
  const scoreRaw = cleanWikiText(cells[5]);
  const sm = scoreRaw.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (!sm) continue;
  coronacionMatches.push({
    compGroup: 'Copa de la Coronación',
    season: '1901/02',
    date: parseEnglishDateToDDMMYYYY(dateClean),
    competition: 'Copa de la Coronación 1902 (Bán kết)',
    venue: 'Hipódromo de la Castellana (Madrid)',
    home,
    away,
    homeGoals: Number(sm[1]),
    awayGoals: Number(sm[2]),
    extraTime: false,
    goalsHome: cleanWikiText(cells[6] || ''),
    goalsAway: cleanWikiText(cells[7] || ''),
  });
}

const allRawMatches = [
  ...ligaMatches,
  ...copaMatches,
  ...supercopaMatches,
  ...uclMatches,
  ...copaLigaMatches,
  ...coronacionMatches,
];

// Verify per-competition stats
function summarizeComp(list, name) {
  let rmW = 0,
    dr = 0,
    baW = 0,
    rmG = 0,
    baG = 0;
  for (const m of list) {
    const isRmHome = m.home.includes('Real Madrid');
    const rg = isRmHome ? m.homeGoals : m.awayGoals;
    const bg = isRmHome ? m.awayGoals : m.homeGoals;
    rmG += rg;
    baG += bg;
    if (rg > bg) rmW++;
    else if (rg === bg) dr++;
    else baW++;
  }
  console.log(
    `${name.padEnd(24)}: ${String(list.length).padStart(3)} matches | RM Wins: ${String(rmW).padStart(3)} | Draws: ${String(dr).padStart(2)} | Barca Wins: ${String(baW).padStart(3)} | Goals RM ${rmG} - ${baG} Barca`
  );
  return { count: list.length, rmW, dr, baW, rmG, baG };
}

console.log('=== VERIFICATION OF WIKIPEDIA COMPETITIVE MATCHES ===');
const sLiga = summarizeComp(ligaMatches, 'La Liga');
const sCopa = summarizeComp(copaMatches, 'Copa del Rey');
const sSuper = summarizeComp(supercopaMatches, 'Supercopa de España');
const sUcl = summarizeComp(uclMatches, 'UEFA Champions League');
const sCopaLiga = summarizeComp(copaLigaMatches, 'Copa de la Liga');
const sCor = summarizeComp(coronacionMatches, 'Copa de la Coronación');
const sTotal = summarizeComp(allRawMatches, 'TOTAL OFFICIAL');

if (
  sLiga.count !== 193 ||
  sCopa.count !== 38 ||
  sSuper.count !== 19 ||
  sUcl.count !== 8 ||
  sCopaLiga.count !== 6 ||
  sCor.count !== 1 ||
  sTotal.count !== 265 ||
  sTotal.rmW !== 107 ||
  sTotal.dr !== 52 ||
  sTotal.baW !== 106 ||
  sTotal.rmG !== 446 ||
  sTotal.baG !== 442
) {
  throw new Error('Count or goal mismatch against Wikipedia official summary!');
}

// Sort chronologically ascending first to assign official matchNumber #1 (13/05/1902) .. #265 (26/10/2026)
function dateToTimestamp(ddmmyyyy) {
  const [d, m, y] = ddmmyyyy.split('/').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getTime();
}

allRawMatches.sort((a, b) => dateToTimestamp(a.date) - dateToTimestamp(b.date));

// Extract top scorer / MVP from Wikipedia goals strings
function deriveMvpAndSummary(m, matchNum) {
  const isRmHome = m.home.includes('Real Madrid');
  const realGoals = isRmHome ? m.homeGoals : m.awayGoals;
  const barcaGoals = isRmHome ? m.awayGoals : m.homeGoals;
  const rmScorersStr = isRmHome ? m.goalsHome : m.goalsAway;
  const barcaScorersStr = isRmHome ? m.goalsAway : m.goalsHome;

  const homeLabel = isRmHome ? 'Real Madrid' : 'FC Barcelona';
  const awayLabel = isRmHome ? 'FC Barcelona' : 'Real Madrid';
  const suffix = m.extraTime ? ' (Hiệp phụ)' : '';
  const scoreDisplay = `${homeLabel} ${m.homeGoals}–${m.awayGoals} ${awayLabel}${suffix}`;

  // Custom exact descriptions for the latest matches (#258 to #265) per specification
  if (matchNum === 265) {
    return {
      score: 'FC Barcelona 1–2 Real Madrid',
      mvp: "Kylian Mbappé (Cú đúp 41', 87')",
      summary: {
        vi: "Kylian Mbappé (#10) lập cú đúp ở phút 41' và 87' (Eduardo Camavinga kiến tạo) giúp đoàn quân của HLV José Mourinho đánh bại Barcelona ngay tại Camp Nou, chính thức cán mốc 100 bàn thắng cho Real Madrid (Raphinha gỡ hòa 1–1 phút 61').",
        en: "Kylian Mbappé (#10) struck twice at 41' and 87' (assisted by Eduardo Camavinga) to lead José Mourinho's Real Madrid past Barcelona at Camp Nou and reach his 100th official goal for the club (Raphinha equalized at 61').",
      },
    };
  }
  if (matchNum === 264) {
    return {
      score: 'FC Barcelona 2–0 Real Madrid',
      mvp: 'Marcus Rashford & Ferran Torres',
      summary: {
        vi: "Trận lượt về La Liga 2025/26 tại Camp Nou, đội chủ nhà ghi 2 bàn ngay trong 20 phút đầu hiệp một do công của Marcus Rashford (9') và Ferran Torres (18').",
        en: "In the 2025/26 La Liga return fixture at Camp Nou, the hosts scored twice inside the opening 20 minutes through Marcus Rashford (9') and Ferran Torres (18').",
      },
    };
  }
  if (matchNum === 263) {
    return {
      score: 'FC Barcelona 3–2 Real Madrid',
      mvp: 'Lamine Yamal & Raphinha',
      summary: {
        vi: "Màn rượt đuổi tỷ số kịch tính trong trận chung kết Siêu cúp Tây Ban Nha 2026 tại Ả Rập Xê-út kết thúc với chiến thắng 3–2 nghiêng về Barcelona (Vinícius Jr 45+2' và Gonzalo García 45+6' lập công cho Real Madrid).",
        en: "A dramatic 2026 Supercopa de España Final in Jeddah ended 3–2, with Vinícius Júnior (45+2') and Gonzalo García (45+6') scoring for Real Madrid.",
      },
    };
  }
  if (matchNum === 262) {
    return {
      score: 'Real Madrid 2–1 FC Barcelona',
      mvp: 'Jude Bellingham (#5) & Kylian Mbappé (#10)',
      summary: {
        vi: "Kylian Mbappé mở tỷ số ở phút 22' và Jude Bellingham ghi bàn ấn định chiến thắng 2–1 ở phút 43' ngay trước giờ nghỉ (Fermín López gỡ hòa tạm thời cho Barca ở phút 38').",
        en: "Kylian Mbappé opened the scoring at 22' and Jude Bellingham netted the 43rd-minute winner at the Bernabéu (Fermín López equalized at 38').",
      },
    };
  }
  if (matchNum === 261) {
    return {
      score: 'FC Barcelona 4–3 Real Madrid',
      mvp: "Kylian Mbappé (Hat-trick 5' p., 14', 70')",
      summary: {
        vi: "Kylian Mbappé lập cú hat-trick trên sân Olímpic Lluís Companys ở các phút 5' (phạt đền), 14' và 70' trong cuộc rượt đuổi tỷ số 4–3 tại Vòng 35 La Liga 2024/25 (E. García 19', Lamine Yamal 32', Raphinha 34', 45').",
        en: "Kylian Mbappé fired a hat-trick (5' pen, 14', 70') at Olímpic Lluís Companys in a 4–3 La Liga Matchweek 35 clash (E. García 19', Lamine Yamal 32', Raphinha 34', 45').",
      },
    };
  }
  if (matchNum === 260) {
    return {
      score: 'FC Barcelona 3–2 Real Madrid (Hiệp phụ)',
      mvp: 'Kylian Mbappé & Aurélien Tchouaméni',
      summary: {
        vi: "Chung kết Cúp Nhà Vua 2024/25 tại La Cartuja (Seville): Kylian Mbappé (70') và Aurélien Tchouaméni (77') đưa Real Madrid vượt lên dẫn 2–1 trước khi trận đấu kéo vào hiệp phụ (Pedri 28', Ferran Torres 84', Koundé 116').",
        en: "2024/25 Copa del Rey Final at La Cartuja (Seville): Kylian Mbappé (70') and Aurélien Tchouaméni (77') put Real Madrid 2–1 ahead before extra time (Pedri 28', Ferran Torres 84', Koundé 116').",
      },
    };
  }
  if (matchNum === 259) {
    return {
      score: 'Real Madrid 2–5 FC Barcelona',
      mvp: "Kylian Mbappé (Mở tỷ số 5') & Rodrygo (60')",
      summary: {
        vi: "Chung kết Siêu Cúp Tây Ban Nha 2025 tại Jeddah: Kylian Mbappé mở tỷ số sớm ở phút thứ 5 và Rodrygo ghi bàn từ đá phạt trực tiếp phút 60' (Lamine Yamal 22', Lewandowski 36' p., Raphinha 39', 48', Balde 45+10').",
        en: "2025 Supercopa de España Final in Jeddah: Kylian Mbappé opened the scoring in the 5th minute and Rodrygo scored a 60th-minute free-kick (Lamine Yamal 22', Lewandowski 36' p., Raphinha 39', 48', Balde 45+10').",
      },
    };
  }
  if (matchNum === 258) {
    return {
      score: 'Real Madrid 0–4 FC Barcelona',
      mvp: 'Robert Lewandowski (54\', 56\')',
      summary: {
        vi: "Trận El Clásico Vòng 11 La Liga 2024/25 tại Santiago Bernabéu: Bàn thắng trong hiệp hai được ghi bởi Lewandowski (54', 56'), Lamine Yamal (77') và Raphinha (84').",
        en: "La Liga 2024/25 Matchweek 11 at the Santiago Bernabéu with second-half goals from Lewandowski (54', 56'), Lamine Yamal (77'), and Raphinha (84').",
      },
    };
  }

  // General historical match formatting from real Wikipedia goalscorer strings
  const winningGoalsStr =
    realGoals > barcaGoals
      ? rmScorersStr
      : barcaGoals > realGoals
      ? barcaScorersStr
      : rmScorersStr || barcaScorersStr;

  // Parse individual scorer tokens like "Name (10, 55)"
  function parseScorerTokens(str) {
    if (!str) return [];
    const tokens = [];
    const regex = /([^,()]+?\s*\([^)]+\))/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      const token = match[1].trim().replace(/^,\s*/, '');
      const isOg = /o\.g\./i.test(token);
      const minsMatch = token.match(/\(([^)]+)\)/);
      const minsList = minsMatch ? minsMatch[1].split(',').map((s) => s.trim()) : [];
      const hasLateWinner = minsList.some((mStr) => {
        const n = parseInt(mStr, 10);
        return n >= 85;
      });
      tokens.push({
        token,
        isOg,
        goalCount: isOg ? 0 : minsList.length,
        hasLateWinner,
      });
    }
    return tokens;
  }

  const winTokens = parseScorerTokens(winningGoalsStr).filter((t) => !t.isOg);
  let mvp = realGoals === 0 && barcaGoals === 0 ? 'Tập thể hai đội (Hòa 0–0)' : 'Tập thể đội chiến thắng';
  if (winTokens.length > 0) {
    // Sort by goalCount desc, then late winner desc
    const sorted = [...winTokens].sort((a, b) => {
      if (b.goalCount !== a.goalCount) return b.goalCount - a.goalCount;
      if (b.hasLateWinner !== a.hasLateWinner) return b.hasLateWinner ? 1 : -1;
      return 0;
    });
    if (sorted.length >= 2 && sorted[0].goalCount === sorted[1].goalCount) {
      mvp = `${sorted[0].token} & ${sorted[1].token}`;
    } else {
      mvp = sorted[0].token;
    }
  }

  const goalPartsVi = [];
  const goalPartsEn = [];
  if (rmScorersStr) {
    goalPartsVi.push(`Real Madrid: ${rmScorersStr}`);
    goalPartsEn.push(`Real Madrid: ${rmScorersStr}`);
  }
  if (barcaScorersStr) {
    goalPartsVi.push(`Barcelona: ${barcaScorersStr}`);
    goalPartsEn.push(`Barcelona: ${barcaScorersStr}`);
  }

  const goalsDetailVi =
    goalPartsVi.length > 0
      ? `Bàn thắng — ${goalPartsVi.join(' | ')}.`
      : 'Trận đấu khép lại mà không có bàn thắng nào được ghi (0–0).';
  const goalsDetailEn =
    goalPartsEn.length > 0
      ? `Scorers — ${goalPartsEn.join(' | ')}.`
      : 'The match ended in a goalless 0–0 draw.';

  return {
    score: scoreDisplay,
    mvp,
    summary: {
      vi: `Trận El Clásico chính thức #${matchNum} thuộc khuôn khổ ${m.competition} tại sân ${m.venue}. ${goalsDetailVi}`,
      en: `Official El Clásico #${matchNum} in ${m.competition} at ${m.venue}. ${goalsDetailEn}`,
    },
  };
}

const formattedAscending = allRawMatches.map((m, idx) => {
  const matchNumber = idx + 1;
  const isRmHome = m.home.includes('Real Madrid');
  const realGoals = isRmHome ? m.homeGoals : m.awayGoals;
  const barcaGoals = isRmHome ? m.awayGoals : m.homeGoals;
  const { score, mvp, summary } = deriveMvpAndSummary(m, matchNumber);
  const scorers = [m.goalsHome, m.goalsAway].filter(Boolean);

  return {
    id: `clasico-${String(matchNumber).padStart(3, '0')}-${m.date.replace(/\//g, '-')}`,
    matchNumber,
    season: m.season,
    date: m.date,
    competition: m.competition,
    venue: m.venue,
    score,
    realGoals,
    barcaGoals,
    scorers,
    mvp,
    summary,
  };
});

// Reverse so newest (#265 — 26/10/2026) is first and oldest (#1 — 13/05/1902) is last
const finalMatchesDesc = [...formattedAscending].reverse();

// Update madrid_analytics.json
const analyticsJson = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
analyticsJson.elClasicoHistory = finalMatchesDesc;
analyticsJson.metadata.elClasicoHeadToHead = {
  totalOfficialMatches: 265,
  realMadridWins: 107,
  barcelonaWins: 106,
  draws: 52,
  realMadridGoals: 446,
  barcelonaGoals: 442,
  latestResult:
    "Barcelona 1–2 Real Madrid (26/10/2026 tại Camp Nou: Mbappé 41', 87' — Cột mốc 100 bàn cho Real Madrid; Raphinha 61')",
};

fs.writeFileSync(JSON_PATH, JSON.stringify(analyticsJson, null, 2), 'utf8');

console.log('\n=== LATEST 15 OFFICIAL EL CLÁSICO MATCHES (#265 DOWN TO #251) ===');
finalMatchesDesc.slice(0, 15).forEach((m) => {
  console.log(
    `#${m.matchNumber} | ${m.date} | [${m.season}] ${m.competition} | ${m.venue} | ${m.score} | MVP: ${m.mvp}`
  );
});
