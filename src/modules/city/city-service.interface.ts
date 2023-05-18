import {DocumentType} from '@typegoose/typegoose';
import CreateCityDto from './dto/create-city.dto';


export interface CityServiceInterface {
  create(dto: CreateCityDto): Promise<DocumentType<AmenityEntity>>;
  findByCityId(cityId: string): Promise<DocumentType<AmenityEntity> | null>;
  findByCityName(cityName: string): Promise<DocumentType<AmenityEntity> | null>;
  findByCityNameOrCreate(cityName: string, dto: CreateCityDto): Promise<DocumentType<AmenityEntity>>;
}
