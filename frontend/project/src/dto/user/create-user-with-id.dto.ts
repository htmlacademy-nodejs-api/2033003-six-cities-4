import { UserType } from '../../const';

export default class CreateUserWithIdDto {
  public id!: string;
  public name!: string;
  public avatar!: string;
  public userType!: UserType;
  public email!: string;
  public password!: string;
}
