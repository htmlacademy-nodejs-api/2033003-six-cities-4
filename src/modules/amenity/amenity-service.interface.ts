import {DocumentType} from '@typegoose/typegoose';


import CreateAmenityDto from './dto/create-amenity.dto.js';
import {AmenityEntity} from './amenity.entity.js';

export interface CategoryServiceInterface {
  create(dto: CreateAmenityDto): Promise<DocumentType<AmenityEntity>>;
  findByCategoryId(categoryId: string): Promise<DocumentType<AmenityEntity> | null>;
  findByCategoryName(categoryName: string): Promise<DocumentType<AmenityEntity> | null>;
  findByCategoryNameOrCreate(categoryName: string, dto: CreateAmenityDto): Promise<DocumentType<AmenityEntity>>;
}
