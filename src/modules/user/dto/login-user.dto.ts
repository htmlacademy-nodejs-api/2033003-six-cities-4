import { IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';

export default class LoginUserDto {
  @IsNotEmpty({ message: 'Email are required' })
  @IsEmail({}, { message: 'Invalid email address' })
  public email!: string;

  @IsNotEmpty({ message: 'Password are required' })
  @MinLength(6, { message: 'Minimum password length must be 6' })
  @MaxLength(12, { message: 'Maximum password length must be 12' })
  public password!: string;
}
