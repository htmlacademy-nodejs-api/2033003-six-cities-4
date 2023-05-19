import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { AppComponent } from '../../types/app-component.enum.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import OfferService from './offer.service.js';

export function createOfferContainer() {
  const cityContainer = new Container();

  cityContainer.bind<OfferServiceInterface>(AppComponent.OfferServiceInterface).to(OfferService);
  cityContainer.bind<types.ModelType<OfferEntity>>(AppComponent.OfferModel).toConstantValue(OfferModel);

  return cityContainer;
}
