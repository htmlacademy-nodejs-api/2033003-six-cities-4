import {DocumentType} from '@typegoose/typegoose';

import { TypeOfUserEntity } from './type-of-user.entity.js';
import CreateTypeOfUserDto from './dto/create-type-of-user.dto.js';

export interface TypeOfUserServiceInterface {
  create(dto: CreateTypeOfUserDto): Promise<DocumentType<TypeOfUserEntity>>;
  findByTypeOfUserId(typeOfUserId: string): Promise<DocumentType<TypeOfUserEntity> | null>;
  findByTypeOfUserName(typeOfUserName: string): Promise<DocumentType<TypeOfUserEntity> | null>;
  findByTypeOfUserNameOrCreate(typeOfUserName: string, dto: CreateTypeOfUserDto): Promise<DocumentType<TypeOfUserEntity>>;
}
