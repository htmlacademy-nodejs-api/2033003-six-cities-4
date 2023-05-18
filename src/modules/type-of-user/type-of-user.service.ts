import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';

import { AppComponent } from '../../types/app-component.enum.js';
import type { LoggerInterface } from '../../core/logger/logger.interface.js';
import { TypeOfUserServiceInterface } from './type-of-user-service.interface.js';
import CreateTypeOfUserDto from './dto/create-type-of-user.dto';
import { TypeOfUserEntity } from './type-of-user.entity.js';

@injectable()
export default class TypeOfUserService implements TypeOfUserServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.TypeOfUserModel) private readonly typeOfUserModel: ModelType<TypeOfUserEntity>
  ) {}

  public async create(dto: CreateTypeOfUserDto): Promise<DocumentType<TypeOfUserEntity>> {
    const result = await this.typeOfUserModel.create(dto);
    this.logger.info(`New type of user created: ${dto.name}`);
    return result;
  }

  public async findByTypeOfUserId(typeOfUserId: string): Promise<DocumentType<TypeOfUserEntity> | null> {
    return this.typeOfUserModel.findById(typeOfUserId).exec();
  }

  public async findByTypeOfUserName(typeOfUserName: string): Promise<DocumentType<TypeOfUserEntity> | null> {
    return this.typeOfUserModel.findOne({name: typeOfUserName}).exec();
  }

  public async findByTypeOfUserNameOrCreate(typeOfUserName: string, dto: CreateTypeOfUserDto): Promise<DocumentType<TypeOfUserEntity>> {
    const existedTypeOfUser = await this.findByTypeOfUserName(typeOfUserName);

    if (existedTypeOfUser) {
      return existedTypeOfUser;
    }

    return this.create(dto);
  }
}
