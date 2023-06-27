import { UserType } from '../../const';

export default class CreateUserDto {
  public name!: string;

  public email!: string;

  public avatar!: string;

  public userType!: UserType;

  public password!: string;
}
