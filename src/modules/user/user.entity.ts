import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { IsEmail, IsEnum, Length } from 'class-validator';

import { UserType } from '../../types/user-type.enum.js';
import type { User } from '../../types/user.type.js';
import { createSHA256 } from '../../core/helpers/index.js';
import CreateUserDto from './dto/create-user.dto.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(userData: CreateUserDto, salt: string) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.userType = userData.userType as UserType;
    this.setPassword(userData.password, salt);
  }

  @prop({ required: true, minlength: 1, maxlength: 15 })
  @Length(1, 15)
  public name = '';

  @prop({ unique: true, required: true })
  @IsEmail()
  public email = '';

  @prop({ required: false, default: '' })
  public avatar:string | undefined;

  @prop({ required: true, minlength: 6, maxlength: 12 })
  @Length(6, 12)
  private password!: string;

  @prop({ required: true, enum: UserType })
  @IsEnum(UserType)
  public userType = UserType.Base;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
