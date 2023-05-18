import { TypeOfRentalEntity } from './type-of-rental.entity';
import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';

import { AppComponent } from '../../types/app-component.enum.js';
import type { LoggerInterface } from '../../core/logger/logger.interface.js';
import { TypeOfRentalServiceInterface } from './type-of-rental-service.interface.js';
import CreateTypeOfRentalDto from './dto/create-type-of-rental.dto';


@injectable()
export default class TypeOfRentalService implements TypeOfRentalServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.TypeOfRentalModel) private readonly typeOfRentalModel: ModelType<TypeOfRentalEntity>
  ) {}

  public async create(dto: CreateTypeOfRentalDto): Promise<DocumentType<TypeOfRentalEntity>> {
    const result = await this.typeOfRentalModel.create(dto);
    this.logger.info(`New type of rental created: ${dto.name}`);
    return result;
  }

  public async findByTypeOfRentalId(typeOfRentalId: string): Promise<DocumentType<TypeOfRentalEntity> | null> {
    return this.typeOfRentalModel.findById(typeOfRentalId).exec();
  }

  public async findByTypeOfRentalName(typeOfRentalName: string): Promise<DocumentType<TypeOfRentalEntity> | null> {
    return this.typeOfRentalModel.findOne({name: typeOfRentalName}).exec();
  }

  public async findByTypeOfRentalNameOrCreate(typeOfRentalName: string, dto: CreateTypeOfRentalDto): Promise<DocumentType<TypeOfRentalEntity>> {
    const existedTypeOfRental = await this.findByTypeOfRentalName(typeOfRentalName);

    if (existedTypeOfRental) {
      return existedTypeOfRental;
    }

    return this.create(dto);
  }
}
