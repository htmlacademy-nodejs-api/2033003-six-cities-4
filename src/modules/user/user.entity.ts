import typegoose, { defaultClasses } from '@typegoose/typegoose';

import { UserType } from '../../types/user-type.enum.js';
import type { User } from '../../types/user.type.js';
import { createSHA256 } from '../../core/helpers/index.js';
import CreateUserDto from './dto/create-user.dto.js';

const { prop, modelOptions, getModelForClass } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, minlength: 1, maxlength: 15 })
  public name: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatar?:string;

  @prop({ required: true, minlength: 6, maxlength: 12 })
  public password!: string;

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
