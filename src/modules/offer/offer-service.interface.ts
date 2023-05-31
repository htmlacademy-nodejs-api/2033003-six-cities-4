import {DocumentType} from '@typegoose/typegoose';

import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  update(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  delete(offerId: string): Promise<boolean>;
  getRentOffers(): Promise<DocumentType<OfferEntity>[]>;
  getOfferDetails(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
