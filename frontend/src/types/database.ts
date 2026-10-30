export type Language = 'vi' | 'en';

export interface BilingualText {
  vi: string;
  en: string;
}

export interface PlayerNationality {
  vi: string;
  en: string;
  flag: string;
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  trophies: number;
  minutesPlayed: number;
  topSpeedKmh: number;
  goalsPer90: number;
  assistsPer90: number;
  gaPer90: number;
  eraZScore: number;
  xG?: number;
  deltaXG?: number;
  marketValueMillions?: number;
  percentileRank?: number;
}

export interface RadarPercentiles {
  scoring: number;
  creativity: number;
  progression: number;
  paceAndPhysical: number;
  defensiveWork: number;
  bigGameImpact: number;
}

export type PositionGroup = 'GK' | 'DEF' | 'MID' | 'FWD';
export type PlayerCategory = 'squad_2026_27' | 'legend';

export interface PlayerProfile {
  id: string;
  name: string;
  fullName?: string;
  shirtNumber: number;
  category: PlayerCategory;
  positionGroup: PositionGroup;
  specificPositions: string[];
  positionFull?: BilingualText;
  nationality: PlayerNationality;
  birthDate: string;
  birthDateAndAge?: BilingualText;
  clubName?: BilingualText;
  height?: string;
  weight?: string;
  preferredFoot?: BilingualText;
  careerClubs?: string;
  era: string;
  marketValue: string;
  contractUntil: string | null;
  imageUrl: string;
  stats: PlayerStats;
  radarPercentiles: RadarPercentiles;
  bio: BilingualText;
  highlights: {
    vi: string[];
    en: string[];
  };
}

export interface TridentMember {
  id: string;
  name: string;
  role: string;
  topSpeedKmh: number;
  gaPer90: number;
  progressiveCarriesPer90: number;
}

export interface Trident2026Analytics {
  title: BilingualText;
  averageTopSpeedKmh: number;
  combinedGaPer90: number;
  expectedThreatPer90: number;
  members: TridentMember[];
  insight: BilingualText;
}

export interface HistoricalEra {
  id: string;
  period: string;
  title: BilingualText;
  bernabeuStage: BilingualText;
  trophiesWon: number;
  icons: string[];
  summary: BilingualText;
}

export interface PitchNode {
  name: string;
  number: number;
  x: number;
  y: number;
}

export interface ChampionsLeagueTitle {
  edition: number;
  year: number;
  titleName: string;
  opponent: string;
  score: string;
  venue: BilingualText;
  coach: string;
  mvp: string;
  scorers: string[];
  story: BilingualText;
  lineup: PitchNode[];
}

export interface ElClasicoMatch {
  id: string;
  matchNumber?: number;
  season?: string;
  date: string;
  competition: string;
  venue: string;
  score: string;
  realGoals: number;
  barcaGoals: number;
  scorers: string[];
  mvp: string;
  summary: BilingualText;
}

export interface GoalInterval {
  window: string;
  goals: number;
  expectedUniform: number;
  sharePct: number;
  notableMoments: string;
}

export interface RemontadaMatch {
  year: number;
  match: string;
  minute: string;
  hero: string;
  winProbBeforeGoalPct: number;
  story: BilingualText;
}

export interface RemontadaAnalytics {
  totalKnockoutGoalsAnalyzed: number;
  lateWindowSharePct: number;
  uniformExpectedSharePct: number;
  chiSquareStat: number;
  pValue: number;
  intervals: GoalInterval[];
  remontadaMatches: RemontadaMatch[];
}

export interface MonteCarloEraTeam {
  id: string;
  name: BilingualText;
  shortName: string;
  coach: string;
  formation: string;
  lambdaAttack: number;
  lambdaDefense: number;
  covarianceL3: number;
  remontadaFactor: number;
  eraRating: number;
  keyStars: string[];
  description: BilingualText;
}

export interface ScorelineProbability {
  score: string;
  probabilityPct: number;
}

export interface PrecomputedMatchup {
  teamA: string;
  teamB: string;
  simulations: number;
  lambdaA: number;
  lambdaB: number;
  covarianceLambda3: number;
  winProbA: number;
  drawProb: number;
  winProbB: number;
  avgGoalsA: number;
  avgGoalsB: number;
  topScorelines: ScorelineProbability[];
}

export interface MonteCarloSimulationData {
  eras: MonteCarloEraTeam[];
  precomputedMatchups: Record<string, PrecomputedMatchup>;
}

export interface ClubLeader {
  id: string;
  name: string;
  role: BilingualText;
  tenure: string;
  trophies: number;
  winRatePct: number | null;
  imageUrl: string;
  legacy: BilingualText;
}

export interface MadridAnalyticsDataset {
  metadata: {
    project: string;
    generatedAt: string;
    clubFounded: string;
    currentSeason: string;
    totalSquad2026_27: number;
    totalLegends: number;
    totalChampionsLeagues: number;
    totalLaLigas: number;
    elClasicoHeadToHead: {
      totalOfficialMatches: number;
      realMadridWins: number;
      barcelonaWins: number;
      draws: number;
      realMadridGoals: number;
      barcelonaGoals: number;
      latestResult: string;
    };
  };
  trident2026Analytics: Trident2026Analytics;
  players: PlayerProfile[];
  historicalEras: HistoricalEra[];
  championsLeagueTitles: ChampionsLeagueTitle[];
  elClasicoHistory: ElClasicoMatch[];
  remontadaAnalytics: RemontadaAnalytics;
  monteCarloSimulation: MonteCarloSimulationData;
  clubLeaders: ClubLeader[];
}
