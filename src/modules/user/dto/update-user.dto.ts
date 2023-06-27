import { IsOptional, IsEmail, MaxLength, MinLength, Matches } from 'class-validator';
import { MAX_LENGTH_PASSWORD, MAX_LENGTH_USERNAME, MIN_LENGTH_PASSWORD, MIN_LENGTH_USERNAME } from '../user.const.js';

export default class UpdateUserDto {
  @IsOptional()
  @MinLength(MIN_LENGTH_USERNAME, {message: `Minimum name length must be ${MIN_LENGTH_USERNAME}`})
  @MaxLength(MAX_LENGTH_USERNAME, {message: `Maximum name length must be ${MAX_LENGTH_USERNAME}`})
  public name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  public email?: string;

  @IsOptional()
  @Matches(/\.(jpg|png)$/, { message: 'Avatar must be in JPG or PNG format' })
  public avatar?: string;

  @IsOptional()
  @MinLength(MIN_LENGTH_PASSWORD, { message: `Minimum password length must be ${MIN_LENGTH_PASSWORD}` })
  @MaxLength(MAX_LENGTH_PASSWORD, { message: `Maximum password length must be ${MAX_LENGTH_PASSWORD}` })
  public password?: string;
}
