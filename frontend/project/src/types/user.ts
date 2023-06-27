import { UserType } from '../const';

export type Signup = {
  name: string,
  userType: UserType,
  email: string,
  avatar: string,
  password: string,
}

export type User = {
  id?: string,
  name: string,
  email: string,
  avatar: string,
  userType: UserType,
  password?: string,
  token?: string,
}
