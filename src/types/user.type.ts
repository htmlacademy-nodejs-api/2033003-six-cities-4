import { UserType } from './user-type.enum.js';

export type User = {
  name: string;
  email: string;
  avatar?: string;
  userType: UserType;
  getPassword(): string;
  setPassword(password: string, salt: string): void;
};
