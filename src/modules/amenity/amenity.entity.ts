import { defaultClasses } from '@typegoose/typegoose';
import typegoose from '@typegoose/typegoose';

import type { Amenity } from '../../types/amenity.type.js';

const {prop, modelOptions, getModelForClass} = typegoose;

export interface AmenityEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'amenities'
  }
})
export class AmenityEntity extends defaultClasses.TimeStamps implements Amenity {
  @prop({required: true, trim: true})
  public name!: string;
}

export const AmenityModel = getModelForClass(AmenityEntity);
