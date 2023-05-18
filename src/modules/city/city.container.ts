import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { AppComponent } from '../../types/app-component.enum.js';
import { CityServiceInterface } from './city-service.interface.js';
import { CityEntity, CityModel } from './city.entity.js';
import CityService from './city.service.js';

export function createCityContainer() {
  const cityContainer = new Container();

  cityContainer.bind<CityServiceInterface>(AppComponent.CityServiceInterface).to(CityService);
  cityContainer.bind<types.ModelType<CityEntity>>(AppComponent.CityModel).toConstantValue(CityModel);

  return cityContainer;
}
