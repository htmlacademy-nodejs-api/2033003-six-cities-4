import { IsOptional, Validate, ArrayMinSize, ArrayMaxSize, IsNumber, IsArray, IsDateString, IsEnum, IsInt, IsMongoId, Max, MaxLength, Min, MinLength, IsBoolean, IsString, IsIn } from 'class-validator';

import { Amenities } from '../../../types/amenities.enum.js';
import { CityCoordinates } from '../../../types/city-coordinates.type.js';
import { RentalType } from '../../../types/rental-type.enum.js';
import { COUNT_IMAGES, MAX_COUNT_OFFER_GUESTS, MAX_COUNT_OFFER_ROOMS, MAX_LENGTH_OFFER_DESCRIPTION, MAX_LENGTH_OFFER_TITLE, MAX_OFFER_PRICE, MAX_OFFER_RATING, MIN_COUNT_COMMENTS, MIN_COUNT_OFFER_GUESTS, MIN_COUNT_OFFER_ROOMS, MIN_LENGTH_OFFER_DESCRIPTION, MIN_LENGTH_OFFER_TITLE, MIN_OFFER_PRICE, MIN_OFFER_RATING, cityCoordinates } from '../offer.const.js';
import { IsValidCoordinates } from '../../../core/helpers/common.js';

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(MIN_LENGTH_OFFER_TITLE, {message: `Minimum title length must be ${MIN_LENGTH_OFFER_TITLE}`})
  @MaxLength(MAX_LENGTH_OFFER_TITLE, {message: `Maximum title length must be ${MAX_LENGTH_OFFER_TITLE}`})
  public title?: string;

  @IsOptional()
  @MinLength(MIN_LENGTH_OFFER_DESCRIPTION, {message: `Minimum description length must be ${MIN_LENGTH_OFFER_DESCRIPTION}`})
  @MaxLength(MAX_LENGTH_OFFER_DESCRIPTION, {message: `Maximum description length must be ${MAX_LENGTH_OFFER_DESCRIPTION}`})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'PostDate must be valid ISO date'})
  public publicationDate?: string;

  @IsOptional()
  @IsIn(Object.keys(cityCoordinates), { message: 'Invalid city' })
  public city?: string;

  @IsOptional()
  @Validate(IsValidCoordinates)
  public coordinates?: CityCoordinates;

  @IsOptional()
  @IsString({ message: 'Preview Image must be an string' })
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(COUNT_IMAGES, { message: `Images array must contain at least ${COUNT_IMAGES}`})
  @ArrayMaxSize(COUNT_IMAGES, { message: `Images array can contain at most ${COUNT_IMAGES}`})
  public images?: string[];

  @IsOptional()
  @IsBoolean({message: 'Field isPremium must be a boolean'})
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({message: 'Field isFavorite must be a boolean'})
  public isFavorite?: boolean;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 }, { message: 'Rating must be a valid number' })
  @Min(MIN_OFFER_RATING, { message: `Minimum rating value must be ${MIN_OFFER_RATING}`})
  @Max(MAX_OFFER_RATING, { message: `Maximum rating value must be ${MAX_OFFER_RATING}` })
  public rating?: number;

  @IsOptional()
  @IsEnum(RentalType, { message: 'Invalid rental type' })
  public type?: RentalType;

  @IsOptional()
  @IsInt({ message: 'Rooms must be an integer' })
  @Min(MIN_COUNT_OFFER_ROOMS, { message: `Minimum number of rooms must be ${MIN_COUNT_OFFER_ROOMS}` })
  @Max(MAX_COUNT_OFFER_ROOMS, { message: `Maximum number of rooms must be ${MAX_COUNT_OFFER_ROOMS}` })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: 'Guests must be an integer' })
  @Min(MIN_COUNT_OFFER_GUESTS, { message: `Minimum number of guests must be ${MIN_COUNT_OFFER_GUESTS}` })
  @Max(MAX_COUNT_OFFER_GUESTS, { message: `Maximum number of guests must be ${MAX_COUNT_OFFER_GUESTS}` })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: 'Price must be an integer' })
  @Min(MIN_OFFER_PRICE, { message: `Minimum number of price must be ${MIN_OFFER_PRICE}` })
  @Max(MAX_OFFER_PRICE, { message: `Maximum number of price must be ${MAX_OFFER_PRICE}` })
  public price?: number;

  @IsOptional()
  @IsEnum(Amenities, { each: true, message: 'Invalid amenity' })
  public amenities?: Amenities[];

  @IsOptional()
  @IsMongoId({message: 'Author field must be valid an id'})
  public userId?: string;

  @IsOptional()
  @IsInt({ message: 'Comment count must be an integer' })
  @Min(MIN_COUNT_COMMENTS, { message: 'Comment count cannot be negative' })
  public commentCount?: number;
}
