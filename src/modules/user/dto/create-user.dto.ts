import { IsNotEmpty, IsEmail, Matches, IsOptional, MaxLength, MinLength, IsIn } from 'class-validator';

import { UserType } from '../../../types/user-type.enum.js';

export default class CreateUserDto {
  @IsNotEmpty({ message: 'Name are required' })
  @MinLength(1, {message: 'Minimum name length must be 1'})
  @MaxLength(15, {message: 'Maximum name length must be 15'})
  public name!: string;

  @IsNotEmpty({ message: 'Email are required' })
  @IsEmail({}, { message: 'Invalid email address' })
  public email!: string;

  @Matches(/\.(jpg|png)$/, { message: 'Avatar must be in JPG or PNG format' })
  @IsOptional()
  public avatar?: string | undefined;

  @IsNotEmpty({ message: 'User Type are required' })
  @IsIn([UserType.Base, UserType.Pro], { message: 'Invalid user type' })
  public userType!: UserType;

  @IsNotEmpty({ message: 'Password are required' })
  @MinLength(6, { message: 'Minimum password length must be 6' })
  @MaxLength(12, { message: 'Maximum password length must be 12' })
  public password!: string;
}
