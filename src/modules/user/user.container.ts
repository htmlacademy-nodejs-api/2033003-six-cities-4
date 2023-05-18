
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';

import { AppComponent } from '../../types/app-component.enum.js';
import UserService from './user.service.js';
import type { UserServiceInterface } from './user-service.interface';
import { UserEntity, UserModel } from './user.entity.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(AppComponent.UserServiceInterface).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(AppComponent.UserModel).toConstantValue(UserModel);

  return userContainer;
}
