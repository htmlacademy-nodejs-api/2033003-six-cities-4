import { Ref, defaultClasses } from '@typegoose/typegoose';
import typegoose from '@typegoose/typegoose';
import { Schema } from 'mongoose';

import { Amenities } from '../../types/amenities.enum.js';
import { RentalType } from '../../types/rental-type.enum.js';
import { City } from '../../types/city.enum.js';
import { UserEntity } from '../user/user.entity.js';
import { CityCoordinates } from '../../types/city-coordinates.type.js';
import { MAX_COUNT_OFFER_GUESTS, MAX_COUNT_OFFER_ROOMS, MAX_LENGTH_OFFER_DESCRIPTION, MAX_LENGTH_OFFER_TITLE, MAX_OFFER_PRICE, MAX_OFFER_RATING, MIN_COUNT_COMMENTS, MIN_COUNT_OFFER_GUESTS, MIN_COUNT_OFFER_ROOMS, MIN_LENGTH_OFFER_DESCRIPTION, MIN_LENGTH_OFFER_TITLE, MIN_OFFER_PRICE, MIN_OFFER_RATING } from './offer.const.js';

const {prop, modelOptions, getModelForClass} = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  },
  options: {
    allowMixed: 0
  }
})
export class OfferEntity extends defaultClasses.TimeStamps{
  @prop({ trim: true, required: true, minlength: MIN_LENGTH_OFFER_TITLE, maxlength: MAX_LENGTH_OFFER_TITLE })
  public title!: string;

  @prop({ trim: true, required: true, minlength: MIN_LENGTH_OFFER_DESCRIPTION, maxlength: MAX_LENGTH_OFFER_DESCRIPTION })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: string;

  @prop({ type: String, enum: City })
  public city!: City;

  @prop({ required: true, type: Schema.Types.Mixed })
  public coordinates!: CityCoordinates;

  @prop({ required: true , default: ''})
  public previewImage!: string;

  @prop({ required: true, type: [String] })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ min: MIN_OFFER_RATING, max: MAX_OFFER_RATING })
  public rating!: number;

  @prop({ type: String, enum: RentalType, required: true })
  public type!: RentalType;

  @prop({ required: true, min: MIN_COUNT_OFFER_ROOMS, max: MAX_COUNT_OFFER_ROOMS })
  public rooms!: number;

  @prop({ required: true, min: MIN_COUNT_OFFER_GUESTS, max: MAX_COUNT_OFFER_GUESTS })
  public guests!: number;

  @prop({ required: true, min: MIN_OFFER_PRICE, max: MAX_OFFER_PRICE })
  public price!: number;

  @prop({ type: String, enum: Amenities, required: true })
  public amenities!: Amenities[];

  @prop({ ref: UserEntity, required: true })
  public userId!: Ref<UserEntity>;

  @prop({default: MIN_COUNT_COMMENTS})
  public commentCount!: number;

  @prop()
  public commentIds!: string[];
}

export const OfferModel = getModelForClass(OfferEntity);
