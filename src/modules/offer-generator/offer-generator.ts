import dayjs from 'dayjs';

import { RentalType } from './../../types/rental-type.enum.js';
import { generateRandomValue, getRandomBoolean, getRandomImages, getRandomItem, getRandomItems, objectToString, randomCoordinates } from '../../core/helpers/index.js';
import { MockData } from '../../types/mock-data.js';
import { DATE_FORMAT, FIRST_WEEK_DAY, LAST_WEEK_DAY, MAX_COUNT_GUESTS, MAX_COUNT_ROOMS, MAX_PRICE, MAX_RATING, MIN_COUNT_GUESTS, MIN_COUNT_ROOMS, MIN_PRICE, MIN_RATING } from '../../const.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').format(DATE_FORMAT);
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomImages(this.mockData.images).join(';');
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const type = getRandomItem<string>([RentalType.Apartment, RentalType.Hotel, RentalType.House, RentalType.Room]);
    const rooms = generateRandomValue(MIN_COUNT_ROOMS, MAX_COUNT_ROOMS).toString();
    const guests = generateRandomValue(MIN_COUNT_GUESTS, MAX_COUNT_GUESTS).toString();
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
