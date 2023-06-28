import { UserType } from '../../const';

export default class UserWithTokenDto {
  public name!: string;
  public avatar!: string;
  public userType!: UserType;
  public email!: string;
  public token!: string;
}
