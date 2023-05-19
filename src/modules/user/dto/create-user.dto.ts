import { UserType } from '../../../types/user-type.enum.js';

export default class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatar?: string | undefined;
  public userType!: UserType;
  public password!: string;
}
