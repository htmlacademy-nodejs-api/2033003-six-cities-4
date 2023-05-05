import { promises } from 'node:fs';

import { FileReaderInterface } from './file-reader.interface';
import { RentalOffer } from '../../types/rental-offer.type';
import { RentalType } from '../../types/rental-type.enum';
import { Amenities } from '../../types/amenities.enum';
import { UserType } from '../../types/user-type.enum';
import { CityCoordinates } from '../../types/city-coordinates.type';
import { cities } from '../../const.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData: string | undefined;

  constructor(public filename: string) { }

  public async read(): Promise<void> {
    this.rawData = await promises.readFile(this.filename, { encoding: 'utf8' });
  }

  public toArray(): RentalOffer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, publicationDate, city, previewImage, images, isPremium, isFavorite, rating, type, rooms, guests, price, amenities, author, email, password, userType, commentsCount]) => {
        const parsedAmenities = amenities.split(';').filter((amenity) => amenity !== '');
        const parsedImages = images.split(';');
        const cityCoordinates: CityCoordinates = cities[city];
        const { latitude, longitude } = cityCoordinates;

        const rentalOffer: RentalOffer = {
          title,
          description,
          publicationDate: new Date(publicationDate),
          city,
          previewImage,
          images: parsedImages,
          isPremium: Boolean(isPremium),
          isFavorite: Boolean(isFavorite),
          rating: parseFloat(rating),
          type: type as RentalType,
          rooms: parseInt(rooms, 10),
          guests: parseInt(guests, 10),
          price: parseFloat(price),
          amenities: parsedAmenities as Amenities[],
          author: {
            name: author,
            email,
            password,
            userType: userType as UserType
          },
          commentsCount: parseInt(commentsCount, 10),
          coordinates: {
            latitude,
            longitude
          }
        };

        return rentalOffer;
      });
  }
}
