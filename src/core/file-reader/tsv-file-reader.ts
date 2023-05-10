import { createReadStream } from 'node:fs';
import EventEmitter from 'node:events';

import { CHUNK_SIZE } from '../../const.js';
import type { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  constructor(public filename: string) { 
    super();
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of stream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        this.emit('line', completeRow);
      }
    }

    this.emit('end', importedRowCount);
  }

  // public toArray(): RentalOffer[] {
  //   if (!this.rawData) {
  //     return [];
  //   }

  //   return this.rawData
  //     .split('\n')
  //     .filter((row) => row.trim() !== '')
  //     .map((line) => line.split('\t'))
  //     .map(([title, description, publicationDate, city, previewImage, images, isPremium, isFavorite, rating, type, rooms, guests, price, amenities, author, email, password, userType, commentsCount]) => {
  //       const parsedAmenities = amenities
  //         .split(';')
  //         .filter((amenity) => amenity !== '')
  //         .map((amenity) => {
  //           if (Object.values(Amenities).includes(amenity as Amenities)) {
  //             return amenity as Amenities;
  //           }
  //           return '';
  //         })
  //         .filter((amenity) => amenity !== '');
  //       const parsedImages = images.split(';');
  //       const { latitude = 0, longitude = 0 } = cities[city as City] || {};

  //       let rentalType: RentalType = RentalType.Apartment;
  //       if (Object.values(RentalType).includes(type as RentalType)) {
  //         rentalType = type as RentalType;
  //       }

  //       let userRole: UserType = UserType.Base;
  //       if (Object.values(UserType).includes(userType as UserType)) {
  //         userRole = userType as UserType;
  //       }

  //       const rentalOffer: RentalOffer = {
  //         title,
  //         description,
  //         publicationDate: new Date(publicationDate).toISOString(),
  //         city,
  //         previewImage,
  //         images: parsedImages,
  //         isPremium: Boolean(isPremium),
  //         isFavorite: Boolean(isFavorite),
  //         rating: parseFloat(rating),
  //         type: rentalType,
  //         rooms: parseInt(rooms, 10),
  //         guests: parseInt(guests, 10),
  //         price: parseFloat(price),
  //         amenities: parsedAmenities as Amenities[],
  //         author: {
  //           name: author,
  //           email,
  //           password,
  //           userType: userRole as UserType
  //         },
  //         commentsCount: parseInt(commentsCount, 10),
  //         coordinates: {
  //           latitude,
  //           longitude
  //         }
  //       };

  //       return rentalOffer;
  //     });
  // }
}
