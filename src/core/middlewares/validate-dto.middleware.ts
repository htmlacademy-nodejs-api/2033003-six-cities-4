import {NextFunction, Request, Response} from 'express';
import {ClassConstructor} from 'class-transformer/types/interfaces/class-constructor.type.js';
import {validate} from 'class-validator';
import {StatusCodes} from 'http-status-codes';
import {plainToClass} from 'class-transformer';
import {MiddlewareInterface} from '../../types/middleware.interface.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        if (error.constraints) {
          return Object.values(error.constraints);
        }
        return [];
      }).join(', ');
      const errorMessage = `Validation failed: ${errorMessages}`;
      res.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
      return;
    }

    next();
  }
}




