import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { AppComponent } from '../../types/app-component.enum.js';
import { TypeOfRentalEntity, TypeOfRentalModel } from './type-of-rental.entity.js';
import TypeOfRentalService from './type-of-rental.service.js';
import type { TypeOfRentalServiceInterface } from './type-of-rental-service.interface.js';

export function createTypeOfRentalContainer() {
  const typeOfRentalContainer = new Container();

  typeOfRentalContainer.bind<TypeOfRentalServiceInterface>(AppComponent.TypeOfRentalServiceInterface).to(TypeOfRentalService);
  typeOfRentalContainer.bind<types.ModelType<TypeOfRentalEntity>>(AppComponent.TypeOfRentalModel).toConstantValue(TypeOfRentalModel);

  return typeOfRentalContainer;
}
