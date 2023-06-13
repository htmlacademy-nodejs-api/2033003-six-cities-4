import { Amenities } from '../../../types/amenities.enum.js';
import { CityCoordinates } from '../../../types/city-coordinates.type.js';
import { RentalType } from '../../../types/rental-type.enum.js';
import { Validate, IsNotEmpty, ArrayMinSize, ArrayMaxSize, IsNumber, IsArray, IsDateString, IsEnum, IsInt, IsMongoId, Max, MaxLength, Min, MinLength, IsBoolean, IsString, IsIn } from 'class-validator';
import { IsValidCoordinates, cityCoordinates } from '../../../const.js';
import { City } from '../../../types/city.enum.js';

export default class CreateOfferDto {
  @IsNotEmpty({ message: 'Title are required' })
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @IsNotEmpty({ message: 'Description are required' })
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
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

  @IsNotEmpty({ message: 'Preview Image are required' })
  @IsString({ message: 'Preview Image must be an string' })
  public previewImage!: string;

  @IsNotEmpty({ message: 'Images are required' })
  @IsArray()
  @ArrayMinSize(6, { message: 'Images array must contain at least 6 images' })
  @ArrayMaxSize(6, { message: 'Images array can contain at most 6 images' })
  public images!: string[];

  @IsNotEmpty({ message: 'Field isPremium are required' })
  @IsBoolean({message: 'Field isPremium must be a boolean'})
  public isPremium!: boolean;

  @IsNotEmpty({ message: 'Field isFavorite are required' })
  @IsBoolean({message: 'Field isFavorite must be a boolean'})
  public isFavorite!: boolean;

  @IsNotEmpty({ message: 'Rating are required' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 }, { message: 'Rating must be a valid number' })
  @Min(1, { message: 'Minimum rating value must be 1' })
  @Max(5, { message: 'Maximum rating value must be 5' })
  public rating!: number;

  @IsNotEmpty({ message: 'Rental type are required' })
  @IsEnum(RentalType, { message: 'Invalid rental type' })
  public type!: RentalType;

  @IsNotEmpty({ message: 'Rooms are required' })
  @IsInt({ message: 'Rooms must be an integer' })
  @Min(1, { message: 'Minimum number of rooms must be 1' })
  @Max(8, { message: 'Maximum number of rooms must be 8' })
  public rooms!: number;

  @IsNotEmpty({ message: 'Guests are required' })
  @IsInt({ message: 'Guests must be an integer' })
  @Min(1, { message: 'Minimum number of rooms must be 1' })
  @Max(10, { message: 'Maximum number of rooms must be 10' })
  public guests!: number;

  @IsNotEmpty({ message: 'Price are required' })
  @IsInt({ message: 'Price must be an integer' })
  @Min(100, { message: 'Minimum number of price must be 100' })
  @Max(100000, { message: 'Maximum number of price must be 100000' })
  public price!: number;

  @IsNotEmpty({ message: 'Amenities are required' })
  @IsEnum(Amenities, { each: true, message: 'Invalid amenity' })
  public amenities!: Amenities[];

  @IsNotEmpty({ message: 'Author are required' })
  @IsMongoId({message: 'Author field must be valid an id'})
  public authorId!: string;

  @IsInt({ message: 'Comment count must be an integer' })
  @Min(0, { message: 'Comment count cannot be negative' })
  public commentCount!: number;
}
