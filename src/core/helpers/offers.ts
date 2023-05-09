import { RentalOffer } from '../../types/rental-offer.type';
import { RentalType } from '../../types/rental-type.enum';

export function createOffer(offerData: string): RentalOffer {
  const [
    title,
    description,
    publicationDate,
    city,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    rooms,
    guests,
    price,
    amenities,
    commentsCount
  ] = offerData.replace('\n', '').split('\t');

  let rentalType: RentalType = RentalType.Apartment;

  if (Object.values(RentalType).includes(type as RentalType)) {
    rentalType = type as RentalType;
  }

  return {
    title,
    description,
    publicationDate: new Date(publicationDate).toISOString(),
    city,
    previewImage,
    images: images.split(';'),
    isPremium: Boolean(isPremium),
    isFavorite: Boolean(isFavorite),
    rating: parseFloat(rating),
    type: rentalType,
    rooms: parseInt(rooms, 10),
    guests: parseInt(guests, 10),
    price: parseFloat(price),
    amenities: amenities as unknown,
    author: offerData as unknown,
    commentsCount: parseInt(commentsCount, 10),
    coordinates: {
      latitude: 12.2323,
      longitude:24.343
    }
  } as RentalOffer;
}
