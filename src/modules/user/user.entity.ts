import typegoose, { defaultClasses } from '@typegoose/typegoose';

import { UserType } from '../../types/user-type.enum.js';
import type { User } from '../../types/user.type.js';
import { createSHA256 } from '../../core/helpers/index.js';
import CreateUserDto from './dto/create-user.dto.js';
import { MAX_LENGTH_USERNAME, MIN_LENGTH_USERNAME } from './user.const.js';
import { Matches } from 'class-validator';

const { prop, modelOptions, getModelForClass } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, minlength: MIN_LENGTH_USERNAME, maxlength: MAX_LENGTH_USERNAME })
  public name: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true })
  @Matches(/\.(jpg|png)$/, { message: 'Avatar must be in JPG or PNG format' })
  public avatar?: string;

  @prop({ required: true })
  private password?: string;

  @prop({ required: true, enum: UserType })
  public userType!: UserType;

  constructor(userData: CreateUserDto) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.userType = userData.userType as UserType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
