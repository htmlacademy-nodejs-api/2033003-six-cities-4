import { defaultClasses } from '@typegoose/typegoose';
import typegoose, {getModelForClass} from '@typegoose/typegoose';

import { TypeOfRental } from '../../types/type-of-rental.js';

const {prop, modelOptions} = typegoose;

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
