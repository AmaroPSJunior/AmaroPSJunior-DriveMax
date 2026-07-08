export type MapProvider = 'google' | 'osm' | 'mapbox';

export interface RouteCoordinate {
  x: number;
  y: number;
}

export interface RideRequest {
  id: string;
  timestamp: string;
  pickup: string;
  destination: string;
  price: number; // in R$
  distance: number; // in km
  durationMinutes: number;
  valuePerKm: number; // R$/km
  direction: 'Norte' | 'Sul' | 'Leste' | 'Oeste';
  efficiencyScore: number; // Calculated rating (0-100) based on earnings potential
  routeColor: string; // Hex color code for visualization
  routePoints: RouteCoordinate[]; // SVG/Canvas coordinates for drawing
  status: 'pending' | 'accepted' | 'ignored';
  rawText: string; // Simulated raw accessibility screen content parsed
}

export interface FilterSettings {
  minPrice: number;
  maxDistance: number;
  minValPerKm: number;
  preferredDirection: 'Qualquer' | 'Norte' | 'Sul' | 'Leste' | 'Oeste';
  sortBy: 'efficiency' | 'price' | 'distance' | 'valPerKm';
}

export interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
  description: string;
}
