import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { AppComponent } from '../../types/app-component.enum.js';
import { TypeOfUserEntity, TypeOfUserModel } from './type-of-user.entity.js';
import TypeOfUserService from './type-of-user.service.js';
import type { TypeOfUserServiceInterface } from './type-of-user-service.interface.js';

export function createTypeOfUserContainer() {
  const typeOfUserContainer = new Container();

  typeOfUserContainer.bind<TypeOfUserServiceInterface>(AppComponent.TypeOfRentalServiceInterface).to(TypeOfUserService);
  typeOfUserContainer.bind<types.ModelType<TypeOfUserEntity>>(AppComponent.TypeOfUserModel).toConstantValue(TypeOfUserModel);

  return typeOfUserContainer;
}
