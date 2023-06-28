import { IsNotEmpty, IsEmail, IsOptional, MaxLength, MinLength, IsEnum } from 'class-validator';

import { UserType } from '../../../types/user-type.enum.js';
import { MAX_LENGTH_PASSWORD, MAX_LENGTH_USERNAME, MIN_LENGTH_PASSWORD, MIN_LENGTH_USERNAME } from '../user.const.js';


export default class CreateUserDto {
  @IsNotEmpty({ message: 'Name are required' })
  @MinLength(MIN_LENGTH_USERNAME, {message: `Minimum name length must be ${MIN_LENGTH_USERNAME}`})
  @MaxLength(MAX_LENGTH_USERNAME, {message: `Maximum name length must be ${MAX_LENGTH_USERNAME}`})
  public name!: string;

  @IsNotEmpty({ message: 'Email are required' })
  @IsEmail({}, { message: 'Invalid email address' })
  public email!: string;

  @IsOptional()
  public avatar?: string;

  @IsNotEmpty({ message: 'User Type are required' })
  @IsEnum(UserType, { message: 'Invalid user type' })
  public userType!: UserType;

  @IsNotEmpty({ message: 'Password are required' })
  @MinLength(MIN_LENGTH_PASSWORD, { message: `Minimum password length must be ${MIN_LENGTH_PASSWORD}` })
  @MaxLength(MAX_LENGTH_PASSWORD, { message: `Maximum password length must be ${MAX_LENGTH_PASSWORD}` })
  public password!: string;
}
