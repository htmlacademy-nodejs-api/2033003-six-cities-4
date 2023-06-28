type CityCoordinates = {
  latitude: number;
  longitude: number;
};

export type City = {
  name: string;
  location: CityCoordinates;
}

enum RentalType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel',
}

enum Amenities {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendlyWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

enum UserType {
  Regular = 'regular',
  Pro = 'pro',
}

export type User = {
  name: string;
  email: string;
  avatar: string;
  userType: UserType;
};

export default class UpdateOfferDto {
  public id!: string;

  public title!: string;

  public description!: string;

  public city!: string;

  public coordinates!: CityCoordinates;

  public previewImage!: string;

  public images!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  public type!: RentalType;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public amenities!: Amenities[];
}
