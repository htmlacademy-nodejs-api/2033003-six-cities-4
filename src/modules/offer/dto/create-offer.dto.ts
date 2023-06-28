import { Amenities } from '../../../types/amenities.enum.js';
import { CityCoordinates } from '../../../types/city-coordinates.type.js';
import { RentalType } from '../../../types/rental-type.enum.js';
import { Validate, IsNotEmpty, ArrayMinSize, ArrayMaxSize, IsNumber, IsArray, IsDateString, IsEnum, IsInt, Max, MaxLength, Min, MinLength, IsBoolean, IsIn } from 'class-validator';
import { City } from '../../../types/city.enum.js';
import { IsValidCoordinates } from '../../../core/helpers/common.js';
import { cityCoordinates } from '../offer.const.js';
import { COUNT_IMAGES, MAX_COUNT_OFFER_ROOMS, MAX_LENGTH_OFFER_DESCRIPTION, MAX_LENGTH_OFFER_TITLE, MAX_OFFER_RATING, MIN_COUNT_OFFER_ROOMS, MIN_LENGTH_OFFER_DESCRIPTION, MIN_LENGTH_OFFER_TITLE, MIN_OFFER_RATING, MIN_COUNT_OFFER_GUESTS, MAX_COUNT_OFFER_GUESTS, MIN_OFFER_PRICE, MAX_OFFER_PRICE, MIN_COUNT_COMMENTS } from './../offer.const.js';

export default class CreateOfferDto {
  @IsNotEmpty({ message: 'Title are required' })
  @MinLength(MIN_LENGTH_OFFER_TITLE, {message: `Minimum title length must be ${MIN_LENGTH_OFFER_TITLE}`})
  @MaxLength(MAX_LENGTH_OFFER_TITLE, {message: `Maximum title length must be ${MAX_LENGTH_OFFER_TITLE}`})
  public title!: string;

  @IsNotEmpty({ message: 'Description are required' })
  @MinLength(MIN_LENGTH_OFFER_DESCRIPTION, {message: `Minimum description length must be ${MIN_LENGTH_OFFER_DESCRIPTION}`})
  @MaxLength(MAX_LENGTH_OFFER_DESCRIPTION, {message: `Maximum description length must be ${MAX_LENGTH_OFFER_DESCRIPTION}`})
  public description!: string;

  @IsNotEmpty({ message: 'PostDate are required' })
  @IsDateString({}, {message: 'PostDate must be valid ISO date'})
  public publicationDate!: string;

  @IsNotEmpty({ message: 'City are required' })
  @IsIn(Object.keys(cityCoordinates), { message: 'Invalid city' })
  public city!: City;

  @IsNotEmpty({ message: 'Coordinates are required' })
  @Validate(IsValidCoordinates)
  public coordinates!: CityCoordinates;

  @IsNotEmpty({ message: 'Images are required' })
  @IsArray()
  @ArrayMinSize(COUNT_IMAGES, { message: `Images array must contain at least ${COUNT_IMAGES}`})
  @ArrayMaxSize(COUNT_IMAGES, { message: `Images array can contain at most ${COUNT_IMAGES}`})
  public images!: string[];

  @IsNotEmpty({ message: 'Field isPremium are required' })
  @IsBoolean({message: 'Field isPremium must be a boolean'})
  public isPremium!: boolean;

  @IsNotEmpty({ message: 'Field isFavorite are required' })
  @IsBoolean({message: 'Field isFavorite must be a boolean'})
  public isFavorite!: boolean;

  @IsNotEmpty({ message: 'Rating are required' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 }, { message: 'Rating must be a valid number' })
  @Min(MIN_OFFER_RATING, { message: `Minimum rating value must be ${MIN_OFFER_RATING}`})
  @Max(MAX_OFFER_RATING, { message: `Maximum rating value must be ${MAX_OFFER_RATING}` })
  public rating!: number;

  @IsNotEmpty({ message: 'Rental type are required' })
  @IsEnum(RentalType, { message: 'Invalid rental type' })
  public type!: RentalType;

  @IsNotEmpty({ message: 'Rooms are required' })
  @IsInt({ message: 'Rooms must be an integer' })
  @Min(MIN_COUNT_OFFER_ROOMS, { message: `Minimum number of rooms must be ${MIN_COUNT_OFFER_ROOMS}` })
  @Max(MAX_COUNT_OFFER_ROOMS, { message: `Maximum number of rooms must be ${MAX_COUNT_OFFER_ROOMS}` })
  public rooms!: number;

  @IsNotEmpty({ message: 'Guests are required' })
  @IsInt({ message: 'Guests must be an integer' })
  @Min(MIN_COUNT_OFFER_GUESTS, { message: `Minimum number of guests must be ${MIN_COUNT_OFFER_GUESTS}` })
  @Max(MAX_COUNT_OFFER_GUESTS, { message: `Maximum number of guests must be ${MAX_COUNT_OFFER_GUESTS}` })
  public guests!: number;

  @IsNotEmpty({ message: 'Price are required' })
  @IsInt({ message: 'Price must be an integer' })
  @Min(MIN_OFFER_PRICE, { message: `Minimum number of price must be ${MIN_OFFER_PRICE}` })
  @Max(MAX_OFFER_PRICE, { message: `Maximum number of price must be ${MAX_OFFER_PRICE}` })
  public price!: number;

  @IsNotEmpty({ message: 'Amenities are required' })
  @IsEnum(Amenities, { each: true, message: 'Invalid amenity' })
  public amenities!: Amenities[];

  public userId!: string;

  @IsInt({ message: 'Comment count must be an integer' })
  @Min(MIN_COUNT_COMMENTS, { message: 'Comment count cannot be negative' })
  public commentCount!: number;
}
