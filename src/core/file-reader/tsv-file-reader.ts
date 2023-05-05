import { promises } from 'node:fs';

import { cities } from '../../const.js';
import { RentalType } from '../../types/rental-type.enum.js';
import { Amenities } from '../../types/amenities.enum.js';
import { UserType } from '../../types/user-type.enum.js';
import type { CityCoordinates } from '../../types/city-coordinates.type.js';
import type { FileReaderInterface } from './file-reader.interface.js';
import type { RentalOffer } from '../../types/rental-offer.type.js';

export default class TSVFileReader implements FileReaderInterface {
  constructor(public filename: string, private rawData?: string) { }

  public async read(): Promise<void> {
    try {
      await promises.access(this.filename);
      this.rawData = await promises.readFile(this.filename, { encoding: 'utf8' });
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      console.log(`Failed to access or read the file: ${error}`);
    }
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
        const { latitude, longitude } = cities[city];

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
