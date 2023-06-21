import { IsOptional, Validate, ArrayMinSize, ArrayMaxSize, IsNumber, IsArray, IsDateString, IsEnum, IsInt, IsMongoId, Max, MaxLength, Min, MinLength, IsBoolean, IsString, IsIn } from 'class-validator';

import { Amenities } from '../../../types/amenities.enum.js';
import { CityCoordinates } from '../../../types/city-coordinates.type.js';
import { RentalType } from '../../../types/rental-type.enum.js';
import { cityCoordinates } from '../offer.const.js';
import { IsValidCoordinates } from '../../../core/helpers/common.js';

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
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
  @ArrayMinSize(6, { message: 'Images array must contain at least 6 images' })
  @ArrayMaxSize(6, { message: 'Images array can contain at most 6 images' })
  public images?: string[];

  @IsOptional()
  @IsBoolean({message: 'Field isPremium must be a boolean'})
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({message: 'Field isFavorite must be a boolean'})
  public isFavorite?: boolean;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 }, { message: 'Rating must be a valid number' })
  @Min(1, { message: 'Minimum rating value must be 1' })
  @Max(5, { message: 'Maximum rating value must be 5' })
  public rating?: number;

  @IsOptional()
  @IsEnum(RentalType, { message: 'Invalid rental type' })
  public type?: RentalType;

  @IsOptional()
  @IsInt({ message: 'Rooms must be an integer' })
  @Min(1, { message: 'Minimum number of rooms must be 1' })
  @Max(8, { message: 'Maximum number of rooms must be 8' })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: 'Guests must be an integer' })
  @Min(1, { message: 'Minimum number of rooms must be 1' })
  @Max(10, { message: 'Maximum number of rooms must be 10' })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: 'Price must be an integer' })
  @Min(100, { message: 'Minimum number of price must be 100' })
  @Max(100000, { message: 'Maximum number of price must be 100000' })
  public price?: number;

  @IsOptional()
  @IsEnum(Amenities, { each: true, message: 'Invalid amenity' })
  public amenities?: Amenities[];

  @IsOptional()
  @IsMongoId({message: 'Author field must be valid an id'})
  public userId?: string;

  @IsOptional()
  @IsInt({ message: 'Comment count must be an integer' })
  @Min(0, { message: 'Comment count cannot be negative' })
  public commentCount?: number;
}
