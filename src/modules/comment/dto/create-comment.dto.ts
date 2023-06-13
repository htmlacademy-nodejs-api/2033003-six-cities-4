import { IsNumber, IsNotEmpty, IsMongoId, Max, MaxLength, Min, MinLength } from 'class-validator';


export default class CreateCommentDto {
  @IsNotEmpty({ message: 'Text are required' })
  @MinLength(5, {message: 'Minimum text length must be 5'})
  @MaxLength(1024, {message: 'Maximum text length must be 1024'})
  public text!: string;

  @IsNotEmpty({ message: 'Rating are required' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 }, { message: 'Rating must be a valid number' })
  @Min(1, { message: 'Minimum rating value must be 1' })
  @Max(5, { message: 'Maximum rating value must be 5' })
  public rating!: number;

  @IsNotEmpty({ message: 'Offer are required' })
  @IsMongoId({message: 'Offer field must be valid an id'})
  public offerId!: string;

  @IsNotEmpty({ message: 'Author are required' })
  @IsMongoId({message: 'Author field must be valid an id'})
  public authorId!: string;
}
