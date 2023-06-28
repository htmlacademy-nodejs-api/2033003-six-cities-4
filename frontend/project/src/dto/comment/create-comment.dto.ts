import { User } from "../offer/offer.dto";

export default class CreateCommentDto {
  public text!: string;

  public date!: string;

  public rating!: number;

  public offerId!: string;
  public userId!: User;
}