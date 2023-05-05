import { Amenities } from './amenities.enum.js';
import { RentalType } from './rental-type.enum.js';
import type { CityCoordinates } from './city-coordinates.type.js';
import type { User } from './user.type.js';

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
  author: User;
  commentsCount: number;
  coordinates: CityCoordinates;
};
