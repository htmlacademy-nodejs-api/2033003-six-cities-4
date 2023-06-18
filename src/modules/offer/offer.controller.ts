import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import * as core from 'express-serve-static-core';

import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import type { OfferServiceInterface } from './offer-service.interface.js';
import { ParamsGetOffer } from '../../types/params-get-offer.type.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { fillDTO } from '../../core/helpers/common.js';
import OfferRdo from './rdo/offer.rdo.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ValidateObjectIdMiddleware } from '../../core/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../core/middlewares/validate-dto.middleware.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DocumentExistsMiddleware } from '../../core/middlewares/document-exists.middleware.js';
import { UnknownRecord } from '../../types/unknown-record.type.js';
import { PrivateRouteMiddleware } from '../../core/middlewares/private-route.middleware.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');
    this.addRoute({path: '/favorites', method: HttpMethod.Get, handler: this.getFavoriteOffers, middlewares: [new PrivateRouteMiddleware()] });
    this.addRoute({path: '/favorites/:offerId', method: HttpMethod.Post, handler: this.addToFavorites, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({path: '/favorites/:offerId', method: HttpMethod.Delete, handler: this.removeFromFavorites, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.showOfferDetails, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.createOffer, middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)]});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({path: '/:offerId', method: HttpMethod.Put, handler: this.update, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteOffer, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]});
    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumOffersForCity });
    this.addRoute({path: '/:offerId/comments', method: HttpMethod.Get, handler: this.getComments, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]});
  }

  public async addToFavorites(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const addedToFavorites = await this.offerService.addToFavorites(offerId);
    this.ok(res, fillDTO(OfferRdo, addedToFavorites));
  }

  public async removeFromFavorites(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const removedFromFavorites = await this.offerService.removeFromFavorites(offerId);
    this.ok(res, fillDTO(OfferRdo, removedFromFavorites));
  }

  public async getPremiumOffersForCity(
    { params, query }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { city } = params;
    const { limit } = query;
    const offers = await this.offerService.getPremiumOffersForCity(city, Number(limit));
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavoriteOffers(
    { query }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { limit } = query;
    const offers = await this.offerService.getFavoriteOffers(Number(limit));
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async index(
    { query }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { limit } = query;
    const offers = await this.offerService.find(Number(limit));
    this.ok(res, fillDTO(OfferRdo, offers || []));
  }

  public async deleteOffer(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const deletedOffer = await this.offerService.delete(offerId);
    this.ok(res, fillDTO(OfferRdo, deletedOffer));
  }

  public async update(
    {params, body}: Request<core.ParamsDictionary | ParamsGetOffer, UnknownRecord, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const updatedOffer = await this.offerService.update(offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async createOffer(
    { body, user }: Request<UnknownRecord, UnknownRecord, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({ ...body, userId: user?.id });
    const offer = await this.offerService.find(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async showOfferDetails(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.getOfferDetails(offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
