import { DocumentType } from '@typegoose/typegoose';

import CreateCommentDto from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';
import { MongoId } from '../../types/mongoId.type.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: MongoId): Promise<DocumentType<CommentEntity>[]>;
  createRating(offerId: MongoId): Promise<boolean>;
  deleteByOfferId(offerId: MongoId): Promise<void>;
}
