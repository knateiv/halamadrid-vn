"""
Data Models & Schemas for HalaMadrid VN (1902-2026) Quantitative Analytics Platform.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class BilingualText:
    vi: str
    en: str


@dataclass
class RadarPercentiles:
    scoring: int
    creativity: int
    progression: int
    paceAndPhysical: int
    defensiveWork: int
    bigGameImpact: int


@dataclass
class PlayerStats:
    appearances: int
    goals: int
    assists: int
    trophies: int
    minutesPlayed: int
    topSpeedKmh: float
    goalsPer90: float = 0.0
    assistsPer90: float = 0.0
    gaPer90: float = 0.0
    eraZScore: float = 0.0


@dataclass
class PlayerProfileSchema:
    id: str
    name: str
    shirtNumber: int
    category: str  # "squad_2026_27" | "legend"
    positionGroup: str  # "GK" | "DEF" | "MID" | "FWD"
    specificPositions: List[str]
    nationality: Dict[str, str]
    birthDate: str
    era: str
    marketValue: str
    contractUntil: Optional[str]
    imageUrl: str
    stats: PlayerStats
    radarPercentiles: RadarPercentiles
    bio: BilingualText
    highlights: Dict[str, List[str]] = field(default_factory=dict)
