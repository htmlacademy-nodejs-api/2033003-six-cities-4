import {DocumentType} from '@typegoose/typegoose';

import CreateAmenityDto from './dto/create-amenity.dto.js';
import {AmenityEntity} from './amenity.entity.js';

export interface AmenityServiceInterface {
  create(dto: CreateAmenityDto): Promise<DocumentType<AmenityEntity>>;
  findByAmenityId(categoryId: string): Promise<DocumentType<AmenityEntity> | null>;
  findByAmenityName(categoryName: string): Promise<DocumentType<AmenityEntity> | null>;
  findByAmenityNameOrCreate(categoryName: string, dto: CreateAmenityDto): Promise<DocumentType<AmenityEntity>>;
}
