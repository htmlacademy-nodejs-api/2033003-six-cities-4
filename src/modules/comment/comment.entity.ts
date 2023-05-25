import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';

import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { MAX_COMMENT_RATING, MAX_LENGTH_COMMENT_TEXT, MIN_COMMENT_RATING, MIN_LENGTH_COMMENT_TEXT } from './comment.const.js';

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
    minlength: MIN_LENGTH_COMMENT_TEXT,
    maxlength: MAX_LENGTH_COMMENT_TEXT
  })
  public text!: string;

  @prop({
    min: MIN_COMMENT_RATING,
    max: MAX_COMMENT_RATING,
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
