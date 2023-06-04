import { inject, injectable } from 'inversify';

import express, { Express } from 'express';

import type { ConfigInterface } from '../core/config/config.interface.js';
import type { LoggerInterface } from '../core/logger/logger.interface.js';
import type { DatabaseClientInterface } from '../core/database-client/mongo-client.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { AppComponent } from '../types/app-component.enum.js';
import { getMongoURI } from '../core/helpers/db.js';
import { ControllerInterface } from '../core/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../core/expception-filters/exception-filter.interface.js';

@injectable()
export default class RestApplication {
  private expressApplication: Express;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponent.UserController) private readonly userController: ControllerInterface,
    @inject(AppComponent.OfferController) private readonly offerController: ControllerInterface,
    @inject(AppComponent.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
  ) {
    this.expressApplication = express();
  }

  private async _initExceptionFilters() {
    this.logger.info('Exception filters initialization');

    this.expressApplication.use(this.exceptionFilter.catch.bind(this.exceptionFilter));

    this.logger.info('Exception filters completed');
  }

  private async _initMiddleware() {
    this.logger.info('Global middleware initialization…');

    this.expressApplication.use(express.json());

    this.logger.info('Global middleware initialization completed');
  }

  private async _initRoutes() {
    this.logger.info('Controller initialization…');

    this.expressApplication.use('/users', this.userController.router);
    this.expressApplication.use('/offers', this.offerController.router);

    this.logger.info('Controller initialization completed');
  }

  private async _initDb() {
    this.logger.info('Init database…');

    const mongoUri = getMongoURI(
      this.config.get('MONGO_INITDB_ROOT_USERNAME'),
      this.config.get('MONGO_INITDB_ROOT_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);

    this.logger.info('Init database completed');
  }

  private async _initServer() {
    this.logger.info('Try to init server...');

    const port = this.config.get('PORT');
    this.expressApplication.listen(port);

    this.logger.info(`🚀Server started on http://localhost:${this.config.get('PORT')}`);
  }

  public async init() {
    this.logger.info('Application initialization…');

    await this._initDb().catch((error) => {
      this.logger.error(`Error during database initialization: ${error.message}`);
    });

    await this._initMiddleware();

    await this._initRoutes();

    await this._initExceptionFilters();

    await this._initServer().catch((error) => {
      this.logger.error(`Error server initialization: ${error.message}`);
    });
  }
}
