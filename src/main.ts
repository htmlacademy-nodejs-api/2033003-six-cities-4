import 'reflect-metadata';
import { Container } from 'inversify';

import RestApplication from './app/rest.js';
import PinoService from './core/logger/pino.service.js';
import ConfigService from './core/config/config.service.js';
import MongoClientService from './core/database-client/database-client.service.js';
import { RestSchema } from './core/config/rest.schema.js';
import { AppComponent } from './types/app-component.enum.js';
import type { LoggerInterface } from './core/logger/logger.interface.js';
import type { ConfigInterface } from './core/config/config.interface.js';
import type { DatabaseClientInterface } from './core/database-client/mongo-client.interface.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(AppComponent.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();
  container.bind<DatabaseClientInterface>(AppComponent.DatabaseClientInterface).to(MongoClientService).inSingletonScope();

  const application = container.get<RestApplication>(AppComponent.RestApplication);
  await application.init();
}

bootstrap();
