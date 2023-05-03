import { CityCoordinates } from './types/city-coordinates.type';
import { City } from './types/city.enum';

export const cities: Record<City, CityCoordinates> = {
  [City.Paris]: { Latitude: 48.85661, Longitude: 2.351499 },
  [City.Cologne]: { Latitude: 50.938361, Longitude: 6.959974 },
  [City.Brussels]: { Latitude: 50.846557, Longitude: 4.351697 },
  [City.Amsterdam]: { Latitude: 52.370216, Longitude: 4.895168 },
  [City.Hamburg]: { Latitude: 53.550341, Longitude: 10.000654 },
  [City.Dusseldorf]: { Latitude: 51.225402, Longitude: 6.776314 }
};
