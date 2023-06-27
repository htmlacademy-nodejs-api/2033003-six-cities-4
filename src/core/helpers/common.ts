import * as crypto from 'node:crypto';

import * as jose from 'jose';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';

import type { CityCoordinates } from '../../types/city-coordinates.type.js';
import { City } from '../../types/city.enum.js';
import { cityCoordinates } from '../../modules/offer/offer.const.js';
import { UnknownRecord } from '../../types/unknown-record.type.js';
import { DEFAULT_STATIC_IMAGES } from '../../app/rest.const.js';

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
  if (!cityEnum) {
    throw new Error('Invalid city');
  }
  return cityCoordinates[cityEnum];
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export async function createJWT(algorithm: string, jwtSecret: string, payload: object, expirationTime: string): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
}

@ValidatorConstraint({ name: 'IsValidCoordinates', async: false })
export class IsValidCoordinates implements ValidatorConstraintInterface {
  validate(coordinates: CityCoordinates) {
    if (
      typeof coordinates === 'object' &&
      typeof coordinates.latitude === 'number' &&
      typeof coordinates.longitude === 'number'
    ) {
      return true;
    }

    return false;
  }

  defaultMessage() {
    return 'Invalid coordinates';
  }
}

export function getFullServerPath(host: string, port: number){
  return `http://${host}:${port}`;
}

function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function transformProperty(
  property: string,
  someObject: UnknownRecord,
  transformFn: (object: UnknownRecord) => void
) {
  Object.keys(someObject).forEach((key) => {
    if (key === property) {
      transformFn(someObject);
    } else if (isObject(someObject[key])) {
      transformProperty(property, someObject[key] as UnknownRecord, transformFn);
    } else if (Array.isArray(someObject[key])) {
      (someObject[key] as UnknownRecord[]).forEach((nestedObject) => {
        if (isObject(nestedObject)) {
          transformProperty(property, nestedObject, transformFn);
        }
      });
    }
  });
}

export function transformObject(properties: string[], staticPath: string, uploadPath: string, data: UnknownRecord) {
  const transformedData: UnknownRecord = { ...data };
  properties.forEach((property) => {
    transformProperty(property, transformedData, (target: UnknownRecord) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      if (typeof target[property] === 'string') {
        target[property] = `${rootPath}/${target[property]}`;
      } else if (Array.isArray(target[property])) {
        target[property] = (target[property] as string[]).map((value) => `${rootPath}/${value}`);
      }
    });
  });
  return transformedData;
}