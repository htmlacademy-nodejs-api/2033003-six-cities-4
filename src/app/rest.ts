import { inject, injectable } from 'inversify';

import type { ConfigInterface } from '../core/config/config.interface.js';
import type { LoggerInterface } from '../core/logger/logger.interface.js';
import type { DatabaseClientInterface } from '../core/database-client/mongo-client.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { AppComponent } from '../types/app-component.enum.js';
import { getMongoURI } from '../core/helpers/db.js';

@injectable()
export default class RestApplication {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface
  ) {}

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('MONGO_INITDB_ROOT_USERNAME'),
      this.config.get('MONGO_INITDB_ROOT_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization…');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    this.logger.info('Init database…');

    await this._initDb().catch((error) => {
      this.logger.error(`Error during database initialization: ${error.message}`);
    });

    this.logger.info('Init database completed');
  }
}
