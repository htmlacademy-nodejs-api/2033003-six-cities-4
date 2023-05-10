import type { RentalOffer } from '../../types/rental-offer.type.js';

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
    avatarUrl,
    password,
    userType,
  ] = offerData.replace('\n', '').split('\t');

  const author = {
    name,
    email,
    avatarUrl,
    password,
    userType
  };

  const coordinates = {
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
    author
  } as RentalOffer;
}
