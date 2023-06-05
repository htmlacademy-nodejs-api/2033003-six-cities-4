import { Amenities } from '../../../types/amenities.enum.js';
import { CityCoordinates } from '../../../types/city-coordinates.type.js';
import { RentalType } from '../../../types/rental-type.enum.js';

export default class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public publicationDate?: string;
  public city?: string;
  public coordinates?: CityCoordinates;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public rating?: number;
  public type?: RentalType;
  public rooms?: number;
  public guests?: number;
  public price?: number;
  public amenities?: Amenities[];
  public authorId?: string;
  public commentCount?: number;
}
