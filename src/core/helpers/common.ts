import * as crypto from 'node:crypto';

import { CityCoordinates } from '../../types/city-coordinates.type.js';
import { City } from '../../types/city.enum.js';
import { cityCoordinates } from '../../const.js';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const comparePassword = (password: string, hashedPassword: string, salt: string): boolean => {
  const computedHash = createSHA256(password, salt);
  return hashedPassword === computedHash;
};

export function getCoordinates(city: string): CityCoordinates {
  const cityEnum: City = City[city as keyof typeof City];
  if (cityEnum) {
    const { latitude, longitude } = cityCoordinates[cityEnum];
    return { latitude, longitude };
  } else {
    throw new Error('Invalid city');
  }
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}
