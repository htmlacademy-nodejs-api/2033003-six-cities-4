import {Expose, Type} from 'class-transformer';

import UserResponse from '../../user/response/user.response.js';
import { PopulateField } from '../../../app/rest.const.js';

export default class OfferResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public image!: string;

  @Expose()
  public postDate!: string;

  @Expose()
  public price!: number;

  @Expose()
  public type!: string;

  @Expose()
  public commentCount!: number;

  @Expose({ name: PopulateField.UserId})
  @Type(() => UserResponse)
  public user!: UserResponse;
}
