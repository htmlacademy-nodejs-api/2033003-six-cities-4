type CityCoordinates = {
  latitude: number;
  longitude: number;
};

enum RentalType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel',
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
export class NewOfferDto {
  public title!: string;
  public description!: string;
  public city!: string;
  public coordinates!: CityCoordinates;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: RentalType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public amenities!: string[];
  public user!: string;
}
