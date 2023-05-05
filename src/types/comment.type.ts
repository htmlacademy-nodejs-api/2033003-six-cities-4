import type { User } from './user.type.js';

export type Comment = {
  text: string;
  publicationDate: Date;
  rating: number;
  author: User;
}
