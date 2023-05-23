import path from 'node:path';

import typegoose, { defaultClasses } from '@typegoose/typegoose';

import { UserType } from '../../types/user-type.enum.js';
import type { User } from '../../types/user.type.js';
import { createSHA256 } from '../../core/helpers/index.js';
import CreateUserDto from './dto/create-user.dto.js';
import { MAX_LENGTH_PASSWORD, MAX_LENGTH_USERNAME, MIN_LENGTH_PASSWORD, MIN_LENGTH_USERNAME } from './user.const.js';

const { prop, modelOptions, getModelForClass } = typegoose;

const imagePath = path.resolve('./assets/default-avatar.png');

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

  @prop({ required: true, default: imagePath })
  public avatar?: string;

  @prop({ required: true, minlength: MIN_LENGTH_PASSWORD, maxlength: MAX_LENGTH_PASSWORD })
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
}

export const UserModel = getModelForClass(UserEntity);
