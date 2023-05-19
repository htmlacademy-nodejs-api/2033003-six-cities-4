import { MAX_OFFER_RATING, MIN_OFFER_RATING } from '../../const.js';

export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]):T[] {
  const startPosition = generateRandomValue(2, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function generateRating(): number {
  const precision = 1;
  const factor = Math.pow(10, precision);
  return Math.floor(Math.random() * (MAX_OFFER_RATING - MIN_OFFER_RATING + 1) * factor) / factor + MIN_OFFER_RATING;
}

export function getRandomImages(images: string[][]): string[] {
  return images.map((imageArray) => {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    return imageArray[randomIndex];
  });
}

export function objectToString<T extends Record<string, unknown>>(obj: T): string {
  const values = Object.values(obj).map((value) => {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  });
  return values.join('\t');
}
