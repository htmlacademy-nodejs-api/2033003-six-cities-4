import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import type { CommentServiceInterface } from './comment-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';
import { MongoId } from '../../types/mongoId.type.js';
import { OfferEntity } from '../offer/offer.entity.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async deleteByOfferId(offerId: MongoId): Promise<void> {
    await this.commentModel.deleteMany({ offerId }).exec();
  }

  public async createRating(offerId: MongoId): Promise<boolean> {
    const comments = await this.commentModel.find({ offerId });

    if (!comments.length) {
      return false;
    }

    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = totalRating / comments.length;

    const updatedOffer = await this.offerModel
      .findByIdAndUpdate(offerId,
        { rating: averageRating },
        { new: true }
      );

    return updatedOffer !== null;
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByOfferId(offerId: MongoId): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .populate('userId');
  }
}
