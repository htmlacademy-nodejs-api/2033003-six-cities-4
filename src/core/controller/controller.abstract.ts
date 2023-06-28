import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import asyncHandler from 'express-async-handler';

import type { ControllerInterface } from './controller.interface.js';
import type { LoggerInterface } from '../logger/logger.interface.js';
import type { RouteInterface } from '../../types/route.interface.js';
import { ConfigInterface } from '../config/config.interface.js';
import { RestSchema } from '../config/rest.schema.js';
import { UnknownRecord } from '../../types/unknown-record.type.js';
import { getFullServerPath, transformObject } from '../helpers/common.js';
import { STATIC_RESOURCE_FIELDS } from '../../app/rest.const.js';
import { EnvConfig } from './../../app/rest.const.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly configService: ConfigInterface<RestSchema>,
  ) {
    this.router = Router();
  }

  getRouter() {
    return this.router;
  }

  public addRoute(route: RouteInterface) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this.router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as UnknownRecord);
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  protected addStaticPath(data: UnknownRecord): void {
    const fullServerPath = getFullServerPath(this.configService.get(EnvConfig.HOST), this.configService.get(EnvConfig.PORT));
    transformObject(
      STATIC_RESOURCE_FIELDS as string[],
      `${fullServerPath}/${this.configService.get(EnvConfig.STATIC_DIRECTORY_PATH)}`,
      `${fullServerPath}/${this.configService.get(EnvConfig.UPLOAD_DIRECTORY)}`,
      data
    );
  }
}
