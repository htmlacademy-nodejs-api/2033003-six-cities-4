import { IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';
import { MAX_LENGTH_PASSWORD, MIN_LENGTH_PASSWORD } from '../user.const.js';

export default class LoginUserDto {
  @IsNotEmpty({ message: 'Email are required' })
  @IsEmail({}, { message: 'Invalid email address' })
  public email!: string;

  @IsNotEmpty({ message: 'Password are required' })
  @MinLength(MIN_LENGTH_PASSWORD, { message: `Minimum password length must be ${MIN_LENGTH_PASSWORD}` })
  @MaxLength(MAX_LENGTH_PASSWORD, { message: `Maximum password length must be ${MAX_LENGTH_PASSWORD}` })
  public password!: string;
}
