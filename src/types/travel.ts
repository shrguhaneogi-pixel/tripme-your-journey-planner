export type TransportMode = 'air' | 'land' | 'water';
export type LandType = 'bus' | 'train';
export type WaterType = 'ferry' | 'cruise';
export type AirType = 'flight';

export interface TravelOption {
  id: string;
  mode: TransportMode;
  type: AirType | LandType | WaterType;
  provider: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  origin: string;
  destination: string;
  amenities?: string[];
  class?: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: Date | undefined;
  returnDate?: Date | undefined;
  tripType: 'one-way' | 'round-trip';
  adults: number;
  children: number;
}
