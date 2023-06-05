import {DocumentType} from '@typegoose/typegoose';

import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import type { MongoId } from '../../types/mongoId.type.js';


//TODO:найти в библиотеках

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  update(offerId: MongoId, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  delete(offerId: MongoId): Promise<DocumentType<OfferEntity> | null>;

  find(count?: number): Promise<DocumentType<OfferEntity>[]>;

  getOfferDetails(offerId: MongoId): Promise<DocumentType<OfferEntity> | null>;

  getPremiumOffersForCity(city: string, count?: number): Promise<DocumentType<OfferEntity>[]>;

  getFavoriteOffers(count?: number): Promise<DocumentType<OfferEntity>[]>;
  addToFavorites(offerId: MongoId): Promise<DocumentType<OfferEntity> | null>;
  removeFromFavorites(offerId: MongoId): Promise<DocumentType<OfferEntity> | null>;

  incCommentCount(offerId: MongoId):Promise<DocumentType<OfferEntity> | null>;

  exists(documentId: string): Promise<boolean>;
}
