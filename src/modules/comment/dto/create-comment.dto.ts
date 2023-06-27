import { IsNumber, IsNotEmpty, IsMongoId, Max, MaxLength, Min, MinLength } from 'class-validator';
import { MAX_COMMENT_RATING, MAX_LENGTH_COMMENT_TEXT, MIN_COMMENT_RATING, MIN_LENGTH_COMMENT_TEXT } from '../comment.const.js';


export default class CreateCommentDto {
  @IsNotEmpty({ message: 'Text are required' })
  @MinLength(MIN_LENGTH_COMMENT_TEXT, {message: `Minimum text length must be ${MIN_LENGTH_COMMENT_TEXT}`})
  @MaxLength(MAX_LENGTH_COMMENT_TEXT, {message: `Maximum text length must be ${MAX_LENGTH_COMMENT_TEXT}`})
  public text!: string;

  @IsNotEmpty({ message: 'Rating are required' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 }, { message: 'Rating must be a valid number' })
  @Min(MIN_COMMENT_RATING, { message: `Minimum rating value must be ${MIN_COMMENT_RATING}`})
  @Max(MAX_COMMENT_RATING, { message: `Maximum rating value must be ${MAX_COMMENT_RATING}` })
  public rating!: number;

  @IsNotEmpty({ message: 'Offer are required' })
  @IsMongoId({message: 'Offer field must be valid an id'})
  public offerId!: string;

  public userId!: string;
}
