import React from 'react';
import { PlayerNationality } from '../types/database';

interface CountryFlagProps {
  nationality: PlayerNationality | string;
  className?: string;
}

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  // English names
  spain: 'es',
  france: 'fr',
  brazil: 'br',
  portugal: 'pt',
  england: 'gb-eng',
  germany: 'de',
  croatia: 'hr',
  uruguay: 'uy',
  belgium: 'be',
  ukraine: 'ua',
  'ivory coast': 'ci',
  "côte d'ivoire": 'ci',
  turkey: 'tr',
  morocco: 'ma',
  austria: 'at',
  argentina: 'ar',
  hungary: 'hu',
  netherlands: 'nl',
  italy: 'it',
  wales: 'gb-wls',
  'costa rica': 'cr',
  colombia: 'co',
  mexico: 'mx',
  denmark: 'dk',
  serbia: 'rs',

  // Vietnamese names
  'tây ban nha': 'es',
  pháp: 'fr',
  'bồ đào nha': 'pt',
  anh: 'gb-eng',
  đức: 'de',
  bỉ: 'be',
  ukraina: 'ua',
  'bờ biển ngà': 'ci',
  'thổ nhĩ kỳ': 'tr',
  'ma-rốc': 'ma',
  áo: 'at',
  'hà lan': 'nl',
  ý: 'it',
  'xứ wales': 'gb-wls',
  'đan mạch': 'dk',

  // ISO / Short codes & Unicode flags
  es: 'es',
  fr: 'fr',
  br: 'br',
  pt: 'pt',
  'gb-eng': 'gb-eng',
  eng: 'gb-eng',
  de: 'de',
  hr: 'hr',
  uy: 'uy',
  be: 'be',
  ua: 'ua',
  ci: 'ci',
  tr: 'tr',
  ma: 'ma',
  at: 'at',
  ar: 'ar',
  hu: 'hu',
  nl: 'nl',
  it: 'it',
  'gb-wls': 'gb-wls',
  wls: 'gb-wls',
  cr: 'cr',
  co: 'co',
  mx: 'mx',
  dk: 'dk',
  rs: 'rs',
  '🇪🇸': 'es',
  '🇫🇷': 'fr',
  '🇧🇷': 'br',
  '🇵🇹': 'pt',
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'gb-eng',
  '🇩🇪': 'de',
  '🇭🇷': 'hr',
  '🇺🇾': 'uy',
  '🇧🇪': 'be',
  '🇺🇦': 'ua',
  '🇨🇮': 'ci',
  '🇹🇷': 'tr',
  '🇲🇦': 'ma',
  '🇦🇹': 'at',
  '🇦🇷': 'ar',
  '🇭🇺': 'hu',
  '🇳🇱': 'nl',
  '🇮🇹': 'it',
  '🏴󠁧󠁢󠁷󠁬󠁳󠁿': 'gb-wls',
  '🇨🇷': 'cr',
  '🇨🇴': 'co',
  '🇲🇽': 'mx',
  '🇩🇰': 'dk',
  '🇷🇸': 'rs',
};

export function resolveCountryCodes(
  nationality: PlayerNationality | string
): Array<{ code: string; name: string }> {
  if (typeof nationality === 'string') {
    const parts = nationality
      .split('/')
      .map((s) => s.trim())
      .filter(Boolean);
    const resolved = parts
      .map((part) => {
        const code = COUNTRY_NAME_TO_CODE[part.toLowerCase()];
        return code ? { code, name: part } : null;
      })
      .filter((item): item is { code: string; name: string } => Boolean(item));
    return resolved.length > 0 ? resolved : [{ code: 'es', name: nationality }];
  }

  // Handle dual nationalities such as "Argentina / Spain" or "Hungary / Spain"
  const rawEn = nationality.en || '';
  const rawVi = nationality.vi || '';
  if (rawEn.includes('/')) {
    const enParts = rawEn.split('/').map((s) => s.trim());
    const viParts = rawVi.split('/').map((s) => s.trim());
    const multi = enParts
      .map((enPart, idx) => {
        const code =
          COUNTRY_NAME_TO_CODE[enPart.toLowerCase()] ||
          COUNTRY_NAME_TO_CODE[(viParts[idx] || '').toLowerCase()];
        return code ? { code, name: viParts[idx] || enPart } : null;
      })
      .filter((item): item is { code: string; name: string } => Boolean(item));
    if (multi.length > 0) return multi;
  }

  const singleCode =
    COUNTRY_NAME_TO_CODE[rawEn.toLowerCase().trim()] ||
    COUNTRY_NAME_TO_CODE[rawVi.toLowerCase().trim()] ||
    COUNTRY_NAME_TO_CODE[(nationality.flag || '').trim()] ||
    'es';

  return [{ code: singleCode, name: rawVi || rawEn || 'Country' }];
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  nationality,
  className = 'inline-block w-5 h-3.5 object-cover rounded-[2px] shadow-sm mr-1.5 align-middle',
}) => {
  const flags = resolveCountryCodes(nationality);

  return (
    <span className="inline-flex items-center align-middle">
      {flags.map((item, idx) => (
        <img
          key={`${item.code}-${idx}`}
          src={`https://flagcdn.com/w40/${item.code}.png`}
          srcSet={`https://flagcdn.com/w80/${item.code}.png 2x`}
          className={className}
          alt={item.name}
          title={item.name}
          loading="lazy"
        />
      ))}
    </span>
  );
};
