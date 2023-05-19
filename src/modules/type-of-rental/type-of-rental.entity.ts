import { defaultClasses } from '@typegoose/typegoose';
import typegoose from '@typegoose/typegoose';

import { TypeOfRental } from '../../types/type-of-rental.js';

const {prop, modelOptions, getModelForClass} = typegoose;

export interface TypeOfRentalEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'rentalTypes'
  }
})
export class TypeOfRentalEntity extends defaultClasses.TimeStamps implements TypeOfRental {
  @prop({required: true, trim: true})
  public name!: string;
}

export const TypeOfRentalModel = getModelForClass(TypeOfRentalEntity);
