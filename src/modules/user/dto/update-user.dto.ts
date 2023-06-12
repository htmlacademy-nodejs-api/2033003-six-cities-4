import { IsOptional, IsEmail, MaxLength, MinLength, Matches } from 'class-validator';

export default class UpdateUserDto {
  @IsOptional()
  @MinLength(1, {message: 'Minimum name length must be 1'})
  @MaxLength(15, {message: 'Maximum name length must be 15'})
  public name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  public email?: string;

  @IsOptional()
  @MinLength(6, { message: 'Minimum password length must be 6' })
  @MaxLength(12, { message: 'Maximum password length must be 12' })
  public password!: string;

  @IsOptional()
  @Matches(/\.(jpg|png)$/, { message: 'Avatar must be in JPG or PNG format' })
  public avatar?: string;
}
