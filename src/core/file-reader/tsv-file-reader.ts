import { readFileSync } from 'node:fs';
import { FileReaderInterface } from './file-reader.interface.js';
import { RentalOffer } from '../../types/rental-offer.type.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): RentalOffer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
    .split('\n')
    .filter((row) => row.trim() !== '')
    .map((line) => line.split('\t'))
    .map(([title, description, publicationDate, city, previewImage, images, isPremium, isFavorite, rating, type, rooms, guests, price, amenities, author, email, password, userType, commentsCount, latitude, longitude]) => {
      const parsedAmenities = amenities.split(';').filter((amenity) => amenity !== '');
      const parsedImages = images.split(';');

      return {
        title,
        description,
        publicationDate: new Date(publicationDate),
        city,
        previewImage,
        images: parsedImages,
        isPremium: isPremium,
        isFavorite: isFavorite,
        rating: parseFloat(rating),
        type: type,
        rooms: parseInt(rooms, 10),
        guests: parseInt(guests, 10),
        price: parseFloat(price),
        amenities: parsedAmenities,
        author: {
          name: author,
          email: email,
          password: password,
          userType: userType
        },
        commentsCount: parseInt(commentsCount, 10),
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      } as unknown as RentalOffer;
    });
  }
}