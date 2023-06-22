import { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import HttpError from '../errors/http-error.js';
import type{ MiddlewareInterface } from './middleware.interface.js';
import type{ UserServiceInterface } from '../../modules/user/user-service.interface.js';


export class UserExistsByEmailMiddleware implements MiddlewareInterface {
  constructor(private readonly userService: UserServiceInterface) {}

  public async execute({ body }: Request, _res: Response, next: NextFunction): Promise<void> {
    const { email } = body;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email ${email} not found.`,
        'UserExistsByEmailMiddleware'
      );
    }

    next();
  }
}
