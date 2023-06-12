import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import * as core from 'express-serve-static-core';

import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import HttpError from '../../core/errors/http-error.js';
import type { OfferServiceInterface } from './offer-service.interface.js';
import { ParamsGetOffer } from '../../types/params-get-offer.type.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { fillDTO } from '../../core/helpers/common.js';
import OfferRdo from './rdo/offer.rdo.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');
    this.addRoute({path: '/favorites', method: HttpMethod.Get, handler: this.getFavoriteOffers });
    this.addRoute({path: '/favorites/:offerId', method: HttpMethod.Post, handler: this.addToFavorites });
    this.addRoute({path: '/favorites/:offerId', method: HttpMethod.Delete, handler: this.removeFromFavorites });
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.showOfferDetails});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({path: '/:offerId', method: HttpMethod.Put, handler: this.update});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteOffer});
    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumOffersForCity });

  }

  public async addToFavorites(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const addedToFavorites = await this.offerService.addToFavorites(offerId);

    if (!addedToFavorites) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, addedToFavorites));
  }

  public async removeFromFavorites(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const removedFromFavorites = await this.offerService.removeFromFavorites(offerId);

    if (!removedFromFavorites) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, removedFromFavorites));
  }

  public async getPremiumOffersForCity(
    { params, query }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { city } = params;
    const { limit } = query;
    const offers = await this.offerService.getPremiumOffersForCity(city, Number(limit));

    if (!offers) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Premium offers for city ${city} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavoriteOffers(
    { query }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const { limit } = query;
    const offers = await this.offerService.getFavoriteOffers(Number(limit));

    if (!offers) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Favorite offers not found.',
        'OfferController'
      );
    }

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

    if (!deletedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, deletedOffer));
  }

  public async update(
    {params, body}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const updatedOffer = await this.offerService.update(offerId, body);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const createdOffer = await this.offerService.create(body);

    if (!createdOffer) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Offer is not created.',
        'OfferController'
      );
    }

    this.created(res, fillDTO(OfferRdo, createdOffer));
  }

  public async showOfferDetails(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.getOfferDetails(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }
}
