enum UserType {
  Regular = 'regular',
  Pro = 'pro',
}

export default class UserDto {
  public name!: string;
  public avatar!: string;
  public userType!: UserType;
  public email!: string;
}
