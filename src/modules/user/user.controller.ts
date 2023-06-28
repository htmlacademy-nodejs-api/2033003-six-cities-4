import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import * as core from 'express-serve-static-core';

import { Controller } from '../../core/controller/controller.abstract.js';
import type { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import CreateUserDto from './dto/create-user.dto.js';
import type { UserServiceInterface } from './user-service.interface.js';
import type { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import HttpError from '../../core/errors/http-error.js';
import UserRdo from './rdo/user.rdo.js';
import { createJWT, fillDTO } from '../../core/helpers/index.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ParamsGetUser } from '../../types/params-get-user.type.js';
import { ValidateObjectIdMiddleware } from '../../core/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../core/middlewares/validate-dto.middleware.js';
import UpdateUserDto from './dto/update-user.dto.js';
import { DocumentExistsMiddleware } from './../../core/middlewares/document-exists.middleware.js';
import { UploadFileMiddleware } from '../../core/middlewares/upload-file.middleware.js';
import { JWT_ALGORITHM, UserControllerRoute } from './user.const.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';
import type { UnknownRecord } from '../../types/unknown-record.type.js';
import { UserExistsByEmailMiddleware } from '../../core/middlewares/user-exists-by-email-middleware.js';
import UploadUserAvatarResponse from './rdo/upload-user-avatar.response.js';
import { EnvConfig, PopulateField } from '../../app/rest.const.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: UserControllerRoute.REGISTER,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: UserControllerRoute.LOGIN,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: UserControllerRoute.EMAIL,
      method: HttpMethod.Get,
      handler: this.findByEmail,
      middlewares: [new UserExistsByEmailMiddleware(this.userService)]
    });
    this.addRoute({
      path: UserControllerRoute.USER,
      method: HttpMethod.Put,
      handler: this.updateById,
      middlewares: [
        new ValidateObjectIdMiddleware(PopulateField.UserId),
        new DocumentExistsMiddleware(this.userService, 'User', PopulateField.UserId),
        new ValidateDtoMiddleware(UpdateUserDto)
      ]
    });
    this.addRoute({
      path: UserControllerRoute.AVATAR,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware(PopulateField.UserId),
        new DocumentExistsMiddleware(this.userService, 'User', PopulateField.UserId),
        new UploadFileMiddleware(this.configService.get(EnvConfig.UPLOAD_DIRECTORY), 'avatar'),
      ]
    });
    this.addRoute({
      path: UserControllerRoute.LOGIN,
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
  }

  public async checkAuthenticate(req: Request, res: Response) {
    if(!req.user){
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const { user: { email } } = req;
    const foundedUser = await this.userService.findByEmail(email);

    if (! foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async updateById(
    { params, body }: Request<core.ParamsDictionary | ParamsGetUser, UnknownRecord, UpdateUserDto>,
    res: Response
  ): Promise<void> {
    const { userId } = params;
    const updatedUser = await this.userService.updateById(userId, body);

    if (!updatedUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'UserController'
      );
    }

    this.ok(res, fillDTO(UserRdo, updatedUser));
  }

  public async findByEmail(
    { body }: Request<core.ParamsDictionary | ParamsGetUser>,
    res: Response
  ): Promise<void> {
    const { email } = body;
    const user = await this.userService.findByEmail(email);

    this.ok(res, fillDTO(UserRdo, user));
  }

  public async login(
    { body }: Request<UnknownRecord, UnknownRecord, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this
      .userService
      .verifyUser(body, this.configService.get(EnvConfig.SALT));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get(EnvConfig.JWT_SECRET),
      {
        email: user.email,
        id: user.id
      },
      this.configService.get(EnvConfig.EXPIRATION_TIME)
    );

    this.ok(res, {
      ...fillDTO(LoggedUserRdo, user),
      token
    });
  }

  public async create(
    {body}: Request<UnknownRecord, UnknownRecord, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get(EnvConfig.SALT));
    this.created(
      res,
      fillDTO(UserRdo, result)
    );
  }

  public async uploadAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const uploadFile = {avatar: req.file?.filename};
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarResponse, uploadFile));
  }
}
