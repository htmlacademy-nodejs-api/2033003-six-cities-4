import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import HttpError from '../../core/errors/http-error.js';
import { fillDTO } from '../../core/helpers/common.js';
import CreateCommentDto from '../comment/dto/create-comment.dto.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import CommentResponse from './response/comment.response.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.createComment });

  }

  public async createComment(
    {body}: Request<object, object, CreateCommentDto>,
    res: Response
  ): Promise<void> {

    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body);
    await this.offerService.incCommentCount(body.offerId);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
