import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import type { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import type { LoggerInterface } from '../core/logger/logger.interface.js';
import type { DatabaseClientInterface } from '../core/database-client/mongo-client.interface.js';
import { AppComponent } from '../types/app-component.enum.js';
import { getMongoURI } from '../core/helpers/db.js';
import { ControllerInterface } from '../core/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../core/exception-filters/exception-filter.interface.js';
import { AuthenticateMiddleware } from '../core/middlewares/authenticate.middleware.js';
import { getFullServerPath } from '../core/helpers/common.js';
import { EnvConfig, RestRoute } from './rest.const.js';


@injectable()
export default class RestApplication {
  private expressApplication: Express;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponent.UserController) private readonly userController: ControllerInterface,
    @inject(AppComponent.OfferController) private readonly offerController: ControllerInterface,
    @inject(AppComponent.CommentController) private readonly commentController: ControllerInterface,
    @inject(AppComponent.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
  ) {
    this.expressApplication = express();
  }

  private async initExceptionFilters() {
    this.logger.info('Exception filters initialization');

    this.expressApplication.use(this.exceptionFilter.catch.bind(this.exceptionFilter));

    this.logger.info('Exception filters completed');
  }

  private async initMiddleware() {
    this.logger.info('Global middleware initialization…');

    this.expressApplication.use(express.json());
    this.expressApplication.use(
      RestRoute.UPLOAD,
      express.static(this.config.get(EnvConfig.UPLOAD_DIRECTORY))
    );

    this.expressApplication.use(
      RestRoute.STATIC,
      express.static(this.config.get(EnvConfig.STATIC_DIRECTORY_PATH))
    );

    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.expressApplication.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.expressApplication.use(cors());
    this.logger.info('Global middleware initialization completed');
  }

  private async initRoutes() {
    this.logger.info('Controller initialization…');

    this.expressApplication.use(RestRoute.USERS, this.userController.getRouter());
    this.expressApplication.use(RestRoute.OFFERS, this.offerController.getRouter());
    this.expressApplication.use(RestRoute.COMMENTS, this.commentController.getRouter());

    this.logger.info('Controller initialization completed');
  }

  private async initDb() {
    this.logger.info('Init database…');

    const mongoUri = getMongoURI(
      this.config.get(EnvConfig.MONGO_INITDB_ROOT_USERNAME),
      this.config.get(EnvConfig.MONGO_INITDB_ROOT_PASSWORD),
      this.config.get(EnvConfig.DB_HOST),
      this.config.get(EnvConfig.DB_PORT),
      this.config.get(EnvConfig.DB_NAME),
    );

    await this.databaseClient.connect(mongoUri);

    this.logger.info('Init database completed');
  }

  private async initServer() {
    this.logger.info('Try to init server...');

    const host = this.config.get(EnvConfig.HOST);
    const port = this.config.get(EnvConfig.PORT);
    this.expressApplication.listen(port);

    this.logger.info(`🚀Server started on ${getFullServerPath(host, port)}`);
  }

  public async init() {
    this.logger.info('Application initialization…');

    await this.initDb().catch((error) => {
      this.logger.error(`Error during database initialization: ${error.message}`);
    });

    await this.initMiddleware();

    await this.initRoutes();

    await this.initExceptionFilters();

    await this.initServer().catch((error) => {
      this.logger.error(`Error server initialization: ${error.message}`);
    });
  }
}
