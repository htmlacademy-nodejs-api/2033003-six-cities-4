import {DocumentType} from '@typegoose/typegoose';

import CreateAmenityDto from './dto/create-amenity.dto.js';
import {AmenityEntity} from './amenity.entity.js';

export interface AmenityServiceInterface {
  create(dto: CreateAmenityDto): Promise<DocumentType<AmenityEntity>>;
  findByAmenityId(amenityId: string): Promise<DocumentType<AmenityEntity> | null>;
  findByAmenityName(amenityName: string): Promise<DocumentType<AmenityEntity> | null>;
  findByAmenityNameOrCreate(amenityName: string, dto: CreateAmenityDto): Promise<DocumentType<AmenityEntity>>;
}
