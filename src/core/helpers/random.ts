import { CityCoordinates } from "../../types/city-coordinates.type";

export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]):T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
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
  const min = 1;
  const max = 5;
  const precision = 1;
  const factor = Math.pow(10, precision);
  return Math.floor(Math.random() * (max - min + 1) * factor) / factor + min;
}

export function randomNumber(min: number, max: number, decimalPlaces: number = 0): number {
  const random = Math.random() * (max - min) + min;
  return Number(random.toFixed(decimalPlaces));
}

export function randomCoordinates(): CityCoordinates {
  const latitude = randomNumber(-90, 90, 6);
  const longitude = randomNumber(-180, 180, 6);
  return { latitude, longitude };
}
