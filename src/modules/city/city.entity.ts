import { defaultClasses } from '@typegoose/typegoose';
import typegoose from '@typegoose/typegoose';

import type { City } from '../../types/city.type.js';

const {prop, modelOptions, getModelForClass} = typegoose;

export interface CityEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'cities'
  }
})
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({required: true, trim: true})
  public name!: string;
}

export const CityModel = getModelForClass(CityEntity);
