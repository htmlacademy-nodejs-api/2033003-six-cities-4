import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';

import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AmenityServiceInterface } from './amenity-service.interface.js';
import CreateAmenityDto from './dto/create-amenity.dto.js';
import { AmenityEntity } from './amenity.entity.js';

@injectable()
export default class AmenityService implements AmenityServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.AmenityModel) private readonly amenityModel: ModelType<AmenityEntity>
  ) {}

  public async create(dto: CreateAmenityDto): Promise<DocumentType<AmenityEntity>> {
    const result = await this.amenityModel.create(dto);
    this.logger.info(`New amenity created: ${dto.name}`);
    return result;
  }

  public async findByAmenityId(amenityId: string): Promise<DocumentType<AmenityEntity> | null> {
    return this.amenityModel.findById(amenityId).exec();
  }

  public async findByAmenityName(amenityName: string): Promise<DocumentType<AmenityEntity> | null> {
    return this.amenityModel.findOne({name: amenityName}).exec();
  }

  public async findByAmenityNameOrCreate(amenityName: string, dto: CreateAmenityDto): Promise<DocumentType<AmenityEntity>> {
    const existedAmenity = await this.findByAmenityName(amenityName);

    if (existedAmenity) {
      return existedAmenity;
    }

    return this.create(dto);
  }
}
