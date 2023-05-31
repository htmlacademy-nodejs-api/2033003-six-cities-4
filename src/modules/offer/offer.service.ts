import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';

import { AppComponent } from '../../types/app-component.enum.js';
import type { LoggerInterface } from '../../core/logger/logger.interface.js';
import type { OfferServiceInterface } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async update(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    throw new Error('Method not implemented.');
  }
  public async delete(offerId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public async getRentOffers(): Promise<DocumentType<OfferEntity>[]> {
    throw new Error('Method not implemented.');
  }

  public async getOfferDetails(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

}
