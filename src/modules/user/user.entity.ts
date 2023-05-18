import typegoose, { getModelForClass } from '@typegoose/typegoose';
import { IsEmail, IsEnum, Length } from 'class-validator';

import { UserType } from '../../types/user-type.enum.js';
import type { User } from '../../types/user.type.js';

const { prop } = typegoose;

export class UserEntity implements User {
  @prop({ required: true, minlength: 1, maxlength: 15 })
  @Length(1, 15)
  public name = '';

  @prop({ unique: true, required: true })
  @IsEmail()
  public email = '';

  @prop({ required: false, default: '' })
  public avatar = '';

  @prop({ required: true, minlength: 6, maxlength: 12 })
  @Length(6, 12)
  public password = '';

  @prop({ required: true, enum: UserType })
  @IsEnum(UserType)
  public userType = UserType.Base;
}

export const UserModel = getModelForClass(UserEntity);
