import 'reflect-metadata';
import { Container } from 'inversify';

import RestApplication from './app/rest.js';
import { AppComponent } from './types/app-component.enum.js';
import { createRestApplicationContainer } from './app/rest.container.js';
import { createUserContainer } from './modules/user/user.container.js';
import { createAmenityContainer } from './modules/amenity/amenity.container.js';
import { createCityContainer } from './modules/city/city.container.js';
import { createTypeOfRentalContainer } from './modules/type-of-rental/type-of-rental.container.js';

async function bootstrap() {
  const mainContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createAmenityContainer(),
    createCityContainer(),
    createTypeOfRentalContainer(),
  );

  const application = mainContainer.get<RestApplication>(AppComponent.RestApplication);
  await application.init();
}

bootstrap();
