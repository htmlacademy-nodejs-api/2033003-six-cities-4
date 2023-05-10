import type { CityCoordinates } from './types/city-coordinates.type.js';
import { City } from './types/city.enum.js';

export const cities: Record<City, CityCoordinates> = {
  [City.Paris]: { latitude: 48.85661, longitude: 2.351499 },
  [City.Cologne]: { latitude: 50.938361, longitude: 6.959974 },
  [City.Brussels]: { latitude: 50.846557, longitude: 4.351697 },
  [City.Amsterdam]: { latitude: 52.370216, longitude: 4.895168 },
  [City.Hamburg]: { latitude: 53.550341, longitude: 10.000654 },
  [City.Dusseldorf]: { latitude: 51.225402, longitude: 6.776314 }
};

export const MIN_PRICE = 500;
export const MAX_PRICE = 2000;

export const FIRST_WEEK_DAY = 1;
export const LAST_WEEK_DAY = 7;

export const DATE_FORMAT = 'YYYY-MM-DD';

export const MIN_RATING = 1;
export const MAX_RATING = 5;

export const MIN_COUNT_ROOMS = 1;
export const MAX_COUNT_ROOMS = 12;

export const MIN_COUNT_GUESTS = 1;
export const MAX_COUNT_GUESTS = 8;
