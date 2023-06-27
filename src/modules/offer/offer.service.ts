import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';

import { AppComponent } from '../../types/app-component.enum.js';
import type { LoggerInterface } from '../../core/logger/logger.interface.js';
import type { OfferServiceInterface } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import type { MongoId } from '../../types/mongoId.type.js';
import { SortType } from '../../types/sort-type.enum.js';
import { DEFAULT_OFFERS_COUNT, DEFAULT_PREMIUM_OFFERS_COUNT } from './offer.const.js';
import { PopulateField } from '../../app/rest.const.js';
import { UserEntity } from '../user/user.entity.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: ModelType<OfferEntity>,
    @inject(AppComponent.UserModel) private readonly userModel: ModelType<UserEntity>
  ) {}

  public async exists(documentId: string): Promise<boolean> {
    return this.offerModel.exists({ _id: documentId }).then((v) => v !== null);
  }

  public async update(offerId: MongoId, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate([PopulateField.UserId])
      .exec();
  }

  public async delete(offerId: MongoId): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  private async findOffers(query: object, limit?: number): Promise<DocumentType<OfferEntity>[]> {
    const offerLimit = limit || DEFAULT_OFFERS_COUNT;
    return this.offerModel
      .find(query)
      .populate([PopulateField.UserId])
      .sort({ publicationDate: SortType.Down })
      .limit(offerLimit)
      .exec();
  }

  public async find(limit?: number): Promise<DocumentType<OfferEntity>[]> {
    return this.findOffers({}, limit);
  }

  public async getPremiumOffersForCity(city?: string): Promise<DocumentType<OfferEntity>[]> {
    const query = { city: city, isPremium: true };
    return this.findOffers(query, DEFAULT_PREMIUM_OFFERS_COUNT);
  }

  public async getFavoriteOffers(userId: MongoId): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return [];
    }

    const favoriteOfferIds = user.favorites;
    const query = { _id: { $in: favoriteOfferIds }, isFavorite: true };

    return this.findOffers(query);
  }

  public async addToFavorites(offerId: MongoId, userId: MongoId): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).exec();
    if (!offer) {
      return null;
    }

    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { favorites: offerId } },
      { new: true }
    ).exec();

    offer.isFavorite = true;
    await offer.save();

    return offer;
  }

  public async removeFromFavorites(offerId: MongoId, userId: MongoId): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).exec();
    if (!offer) {
      return null;
    }

    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { favorites: offerId } },
      { new: true }
    ).exec();

    offer.isFavorite = false;
    await offer.save();

    return offer;
  }

  public async incCommentCount(offerId: MongoId): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async getOfferDetails(offerId: MongoId): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate([PopulateField.UserId])
      .exec();
  }

}
