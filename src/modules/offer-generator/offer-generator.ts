import { RentalType } from './../../types/rental-type.enum';
import { RentalType, Amenities } from './../../types/rentalOffer.types';
import dayjs from 'dayjs';

import { generateRandomValue, getRandomImages, getRandomItem, getRandomItems } from "../../core/helpers";
import { MockData } from "../../types/mock-data";

const MIN_PRICE = 500;
const MAX_PRICE = 2000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class OfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomImages(this.mockData.images);
    const type = getRandomItem<string>([RentalType.Apartment, RentalType.Hotel, RentalType.House, RentalType.Room]);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const amenities = getRandomItems<string>(this.mockData.amenities).join(';');
    const autor = getRandomItem(this.mockData.authors);

    return [
      title, description, publicationDate,
      city, type, price, previewImage,
      images, amenities, autor
    ].join('\t');
  }
}