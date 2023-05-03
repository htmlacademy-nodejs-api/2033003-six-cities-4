import { Amenities } from './amenities.enum';
import { CityCoordinates } from './city-coordinates.type';
import { RentalType } from './rental-type.enum';
import { UserType } from './user-type.enum';

export type RentalOffer = {
  title: string;
  description: string;
  publicationDate: Date;
  city: string;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: RentalType;
  rooms: number;
  guests: number;
  price: number;
  amenities: Amenities[];
  author: UserType;
  commentsCount: number;
  coordinates: CityCoordinates;
};
