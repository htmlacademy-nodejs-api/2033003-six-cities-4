import { defaultClasses } from '@typegoose/typegoose';
import typegoose from '@typegoose/typegoose';

import { TypeOfUser } from '../../types/type-of-user.js';

const {prop, modelOptions, getModelForClass} = typegoose;

export interface TypeOfUserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'userTypes'
  }
})
export class TypeOfUserEntity extends defaultClasses.TimeStamps implements TypeOfUser {
  @prop({required: true, trim: true})
  public name!: string;
}

export const TypeOfUserModel = getModelForClass(TypeOfUserEntity);
