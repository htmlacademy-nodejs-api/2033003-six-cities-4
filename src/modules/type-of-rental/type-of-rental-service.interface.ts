import {DocumentType} from '@typegoose/typegoose';

import { TypeOfRentalEntity } from './type-of-rental.entity.js';
import CreateTypeOfRentalDto from './dto/create-type-of-rental.dto.js';

export interface TypeOfRentalServiceInterface {
  create(dto: CreateTypeOfRentalDto): Promise<DocumentType<TypeOfRentalEntity>>;
  findByTypeOfRentalId(typeOfRentalId: string): Promise<DocumentType<TypeOfRentalEntity> | null>;
  findByTypeOfRentalName(typeOfRentalName: string): Promise<DocumentType<TypeOfRentalEntity> | null>;
  findByTypeOfRentalNameOrCreate(typeOfRentalName: string, dto: CreateTypeOfRentalDto): Promise<DocumentType<TypeOfRentalEntity>>;
}
