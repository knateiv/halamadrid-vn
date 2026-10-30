import { Language, PlayerProfile, PositionGroup } from '../types/database';

export function formatFilterPos(pos: 'ALL' | PositionGroup, _lang?: Language): string {
  return pos;
}

export function formatPositionGroup(group: PositionGroup, _lang?: Language): string {
  return group;
}

export function formatSpecificPosition(code: string, _lang?: Language): string {
  return code.trim().toUpperCase();
}

export function formatSpecificPositionsList(
  positions: string[],
  _lang?: Language,
  separator = '/'
): string {
  return positions.join(separator);
}

export function formatPlayerFullPosition(player: PlayerProfile, _lang?: Language): string {
  return `${player.positionGroup} • ${player.specificPositions.join('/')}`;
}
