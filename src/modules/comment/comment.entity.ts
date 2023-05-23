import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';

import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { MAX_LENGTH_COMMENT_TEXT, MAX_OFFER_RATING, MIN_LENGTH_COMMENT_TEXT, MIN_OFFER_RATING } from '../../const.js';

const { prop, modelOptions } = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true,
    min: MIN_LENGTH_COMMENT_TEXT,
    max: MAX_LENGTH_COMMENT_TEXT
  })
  public text!: string;

  @prop({ 
    min: MIN_OFFER_RATING,
    max: MAX_OFFER_RATING,
    required: true
  })
  public rating!: number;

  @prop({
    ref: OfferEntity,
    required: true
  })
  public offerId!: Ref<OfferEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public authorId!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
