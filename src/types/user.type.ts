import { UserType } from './user-type.enum.js';

export type User = {
  name: string;
  email: string;
  avatar?: string | undefined;
  userType: UserType;
  password: string;
};
