import type { CityCoordinates } from './types/city-coordinates.type.js';
import { City } from './types/city.enum.js';

export const cityCoordinates: Record<City, CityCoordinates> = {
  [City.Paris]: { latitude: 48.85661, longitude: 2.351499 },
  [City.Cologne]: { latitude: 50.938361, longitude: 6.959974 },
  [City.Brussels]: { latitude: 50.846557, longitude: 4.351697 },
  [City.Amsterdam]: { latitude: 52.370216, longitude: 4.895168 },
  [City.Hamburg]: { latitude: 53.550341, longitude: 10.000654 },
  [City.Dusseldorf]: { latitude: 51.225402, longitude: 6.776314 }
};

export const MIN_OFFER_PRICE = 100;
export const MAX_OFFER_PRICE = 100000;

export const FIRST_WEEK_DAY = 1;
export const LAST_WEEK_DAY = 7;

export const DATE_FORMAT = 'YYYY-MM-DD';

export const MIN_OFFER_RATING = 1;
export const MAX_OFFER_RATING = 5;

export const MIN_COUNT_OFFER_ROOMS = 1;
export const MAX_COUNT_OFFER_ROOMS = 8;

export const MIN_COUNT_OFFER_GUESTS = 1;
export const MAX_COUNT_OFFER_GUESTS = 10;

export const CHUNK_SIZE_READER = 16384;
export const CHUNK_SIZE_WRITER = 2 ** 16;

export const RETRY_COUNT = 5;
export const RETRY_TIMEOUT = 1000;

export const DEFAULT_DB_PORT = '27017';
export const DEFAULT_USER_PASSWORD = '123456';

export const MIN_LENGTH_OFFER_TITLE = 10;
export const MAX_LENGTH_OFFER_TITLE = 100;

export const MIN_LENGTH_OFFER_DESCRIPTION = 20;
export const MAX_LENGTH_OFFER_DESCRIPTION = 1024;

export const MIN_LENGTH_PASSWORD = 6;
export const MAX_LENGTH_PASSWORD = 12;

export const MIN_LENGTH_USERNAME = 1;
export const MAX_LENGTH_USERNAME = 15;

export const COMMENT_COUNT = 0;

export const MIN_LENGTH_COMMENT_TEXT = 5;
export const MAX_LENGTH_COMMENT_TEXT = 1024;
