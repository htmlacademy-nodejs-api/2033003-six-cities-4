export type MockData = {
  titles: string[];
  descriptions: string[];
  cities: string[];
  previewImages: string[];
  images: string[][];
  isPremium: string;
  isFavorite: string;
  rating: string;
  rooms: string;
  guests: string;
  types: string[];
  amenities: string[];
  authors: {
    name: string;
    email: string;
    avatar: string;
    password: string;
    userType: string;
  }[];
  coordinates: {
    latitude: string;
    longitude: string;
  }
};
