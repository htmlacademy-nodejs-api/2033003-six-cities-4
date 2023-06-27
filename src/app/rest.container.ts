import { Container } from 'inversify';

import { AppComponent } from '../types/app-component.enum.js';
import { RestSchema } from '../core/config/rest.schema.js';
import type { ConfigInterface } from '../core/config/config.interface.js';
import ConfigService from '../core/config/config.service.js';
import type { DatabaseClientInterface } from '../core/database-client/mongo-client.interface.js';
import MongoClientService from '../core/database-client/database-client.service.js';
import type { ExceptionFilterInterface } from '../core/exception-filters/exception-filter.interface.js';
import ExceptionFilter from '../core/exception-filters/exception-filter.js';
import type { LoggerInterface } from '../core/logger/logger.interface.js';
import PinoService from '../core/logger/pino.service.js';
import RestApplication from './rest.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(AppComponent.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  restApplicationContainer.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();
  restApplicationContainer.bind<DatabaseClientInterface>(AppComponent.DatabaseClientInterface).to(MongoClientService).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilterInterface>(AppComponent.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();

  return restApplicationContainer;
}
