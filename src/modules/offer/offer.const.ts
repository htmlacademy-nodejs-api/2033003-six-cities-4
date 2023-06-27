import { CityCoordinates } from '../../types/city-coordinates.type.js';
import { City } from '../../types/city.enum.js';

export const MIN_OFFER_PRICE = 100;
export const MAX_OFFER_PRICE = 100000;

export const MIN_LENGTH_OFFER_TITLE = 10;
export const MAX_LENGTH_OFFER_TITLE = 100;

export const MIN_LENGTH_OFFER_DESCRIPTION = 20;
export const MAX_LENGTH_OFFER_DESCRIPTION = 1024;

export const MIN_OFFER_RATING = 1;
export const MAX_OFFER_RATING = 5;

export const MIN_COUNT_OFFER_ROOMS = 1;
export const MAX_COUNT_OFFER_ROOMS = 8;

export const MIN_COUNT_OFFER_GUESTS = 1;
export const MAX_COUNT_OFFER_GUESTS = 10;

export const DEFAULT_OFFERS_COUNT = 60;

export const MAX_COUNT_OFFER_IMAGES = 6;

export const DEFAULT_PREMIUM_OFFERS_COUNT = 3;

export const cityCoordinates: Record<City, CityCoordinates> = {
  [City.Paris]: { latitude: 48.85661, longitude: 2.351499 },
  [City.Cologne]: { latitude: 50.938361, longitude: 6.959974 },
  [City.Brussels]: { latitude: 50.846557, longitude: 4.351697 },
  [City.Amsterdam]: { latitude: 52.370216, longitude: 4.895168 },
  [City.Hamburg]: { latitude: 53.550341, longitude: 10.000654 },
  [City.Dusseldorf]: { latitude: 51.225402, longitude: 6.776314 }
};
