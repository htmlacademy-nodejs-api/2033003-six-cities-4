import { Ref, defaultClasses } from '@typegoose/typegoose';
import typegoose from '@typegoose/typegoose';

import { Amenities } from '../../types/amenities.enum.js';
import { RentalType } from '../../types/rental-type.enum.js';
import { City } from '../../types/city.enum.js';
import { UserEntity } from '../user/user.entity.js';

export type CityCoordinates = {
  latitude: number;
  longitude: number;
};

const {prop, modelOptions, getModelForClass} = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps{
  @prop({ trim: true, required: true, minlength: 10, maxlength: 100 })
  public title!: string;

  @prop({ trim: true, required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: string;

  @prop({ type: () => String, enum: City })
  public city!: City;

  @prop({ required: true, type: () => CityCoordinates })
  public coordinates!: CityCoordinates;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ min: 1, max: 5 })
  public rating!: number;

  @prop({ type: () => String, enum: RentalType, required: true })
  public type!: RentalType;

  @prop({ required: true, min: 1, max: 8 })
  public rooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guests!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({ type: () => String, enum: Amenities, required: true })
  public amenities!: Amenities;

  @prop({ ref: UserEntity, required: true })
  public userId!: Ref<UserEntity>;

  @prop({default: 0})
  public commentCount!: number;
}

export const OfferModel = getModelForClass(OfferEntity);
