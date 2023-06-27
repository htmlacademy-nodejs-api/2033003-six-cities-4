import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import * as core from 'express-serve-static-core';
import { ParamsDictionary } from 'express-serve-static-core';

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
import { RentalOffer } from '../../types/rental-offer.type.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../core/errors/http-error.js';
import { UploadFileMiddleware } from '../../core/middlewares/upload-file.middleware.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import UploadImageResponse from './rdo/upload-image.response.js';
import { OfferControllerRoute } from './offer.const.js';

type ParamsOfferDetails = {
  offerId: string;
} | ParamsDictionary

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for OfferController…');
    this.addRoute({ path: OfferControllerRoute.FAVORITES, method: HttpMethod.Get, handler: this.getFavoriteOffers, middlewares: [new PrivateRouteMiddleware()] });
    this.addRoute({ path: OfferControllerRoute.ADD_TO_FAVORITES, method: HttpMethod.Post, handler: this.addToFavorites, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: OfferControllerRoute.REMOVE_FROM_FAVORITES, method: HttpMethod.Delete, handler: this.removeFromFavorites, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: OfferControllerRoute.OFFER_DETAILS, method: HttpMethod.Get, handler: this.showOfferDetails, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]});
    this.addRoute({ path: OfferControllerRoute.CREATE_OFFER, method: HttpMethod.Post, handler: this.createOffer, middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)]});
    this.addRoute({ path: OfferControllerRoute.INDEX, method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: OfferControllerRoute.UPDATE, method: HttpMethod.Put, handler: this.update, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]});
    this.addRoute({ path: OfferControllerRoute.DELETE_OFFER, method: HttpMethod.Delete, handler: this.deleteOffer, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]});
    this.addRoute({ path: OfferControllerRoute.PREMIUM_OFFERS_FOR_CITY, method: HttpMethod.Get, handler: this.getPremiumOffersForCity });
    this.addRoute({ path: OfferControllerRoute.GET_COMMENTS, method: HttpMethod.Get, handler: this.getComments, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]});
    this.addRoute({
      path: OfferControllerRoute.UPLOAD_IMAGE,
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image'),
      ]
    });
  }

  public async uploadImage(req: Request<ParamsOfferDetails>, res: Response) {
    const {offerId} = req.params;
    const updateDto = { previewImage: req.file?.filename };
    await this.offerService.update(offerId, updateDto);
    this.created(res, fillDTO(UploadImageResponse, {updateDto}));
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
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { city } = params;
    const offers = await this.offerService.getPremiumOffersForCity(city);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavoriteOffers(
    _req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.getFavoriteOffers();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async index(
    { query, user }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { limit } = query;
    const isAuthorized = !!user;

    const offers = await this.offerService.find(Number(limit));

    const offersWithFavoriteFlag: RentalOffer[] = offers.map((offer) => ({
      ...JSON.parse(JSON.stringify(offer)),
      isFavorite: isAuthorized ? offer.isFavorite : false,
    }));

    this.ok(res, fillDTO(OfferRdo, offersWithFavoriteFlag || []));
  }

  public async deleteOffer(
    {params, user}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const deletedOffer = await this.offerService.delete(offerId);

    if (deletedOffer?.userId?.toString() !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You are not the owner of the offer',
        'UserController'
      );
    }

    await this.commentService.deleteByOfferId(offerId);
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
    const offer = await this.offerService.getOfferDetails(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async showOfferDetails(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.getOfferDetails(offerId);

    const comments = await this.commentService.findByOfferId(offerId);
    const commentIds = comments.map((comment) => comment.id);

    const offerWithComments: RentalOffer = {
      ...JSON.parse(JSON.stringify(offer)),
      commentIds,
    };

    this.ok(res, fillDTO(OfferRdo, offerWithComments));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
