import * as crypto from 'node:crypto';
import { CityCoordinates } from '../../types/city-coordinates.type';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const createCityCoordinates = (): CityCoordinates => {
  return {
    latitude: 0,
    longitude: 0
  };
};
