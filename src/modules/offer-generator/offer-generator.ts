import dayjs from 'dayjs';

import { RentalType } from './../../types/rental-type.enum.js';
import { generateRandomValue, getRandomBoolean, getRandomImages, getRandomItem, getRandomItems, objectToString, randomCoordinates } from '../../core/helpers/index.js';
import { MockData } from '../../types/mock-data.js';

const MIN_PRICE = 500;
const MAX_PRICE = 2000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class OfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').format('YYYY-MM-DD');
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomImages(this.mockData.images).join(';');
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(1, 5, 1).toString();
    const type = getRandomItem<string>([RentalType.Apartment, RentalType.Hotel, RentalType.House, RentalType.Room]);
    const rooms = generateRandomValue(1, 12).toString();
    const guests = generateRandomValue(1, 8).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const amenities = getRandomItems<string>(this.mockData.amenities).join(';');
    const author = objectToString(getRandomItem(this.mockData.authors));
    const coordinates = objectToString(randomCoordinates());

    return [
      title, description, publicationDate,
      city, previewImage, images,isPremium,
      isFavorite, rating, type, rooms, guests,
      price, amenities, author, coordinates
    ].join('\t');
  }
}
