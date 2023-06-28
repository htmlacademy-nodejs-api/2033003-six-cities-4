import { CityCoordinates } from '../../types/city-coordinates.type.js';
import type { RentalOffer } from '../../types/rental-offer.type.js';
import { UserType } from '../../types/user-type.enum.js';

export function createOffer(offerData: string): RentalOffer {
  const [
    title,
    description,
    publicationDate,
    city,
    longitude,
    latitude,
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
    name,
    email,
    avatar,
    password,
    userType,
    commentCount
  ] = offerData.replace('\n', '').split('\t');

  let userTypeValue: UserType;

  if (userType === UserType.Regular || userType === UserType.Pro) {
    userTypeValue = userType as UserType;
  } else {
    userTypeValue = UserType.Regular;
  }

  const user = {
    name,
    email,
    avatar,
    password,
    userType: userTypeValue,
  };

  const coordinates: CityCoordinates = {
    longitude: parseInt(longitude, 10),
    latitude: parseInt(latitude, 10),
  };

  return {
    title,
    description,
    publicationDate: new Date(publicationDate).toISOString(),
    city,
    coordinates,
    previewImage,
    images: images.split(';'),
    isPremium: Boolean(isPremium),
    isFavorite: Boolean(isFavorite),
    rating: parseFloat(rating),
    type,
    rooms: parseInt(rooms, 10),
    guests: parseInt(guests, 10),
    price: parseFloat(price),
    amenities: amenities.split(';'),
    user,
    commentCount: parseInt(commentCount, 10)
  } as RentalOffer;
}
