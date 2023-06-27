import {Expose, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';
import { PopulateField } from '../../../app/rest.const.js';

export default class CommentResponse {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose({ name: 'createdAt'})
  public publicationDate!: string;

  @Expose()
  public rating!: string;

  @Expose({ name: PopulateField.UserId})
  @Type(() => UserResponse)
  public user!: UserResponse;
}
