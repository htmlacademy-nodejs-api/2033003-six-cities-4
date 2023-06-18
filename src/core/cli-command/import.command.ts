import { RentalOffer } from '../../types/rental-offer.type.js';
import { getErrorMessage } from '../helpers/common.js';
import { getMongoURI } from '../helpers/db.js';
import { createOffer } from '../helpers/offers.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import MongoClientService from '../database-client/database-client.service.js';
import type { DatabaseClientInterface } from '../database-client/mongo-client.interface.js';
import ConsoleLoggerService from '../logger/console.service.js';
import type { LoggerInterface } from '../logger/logger.interface.js';
import type { CliCommandInterface } from './cli-command.interface.js';

import { UserModel } from '../../modules/user/user.entity.js';
import type { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import UserService from '../../modules/user/user.service.js';
import { OfferServiceInterface } from '../../modules/offer/offer-service.interface.js';
import OfferService from '../../modules/offer/offer.service.js';
import { OfferModel } from '../../modules/offer/offer.entity.js';
import { CityCoordinates } from '../../types/city-coordinates.type.js';
import { DEFAULT_USER_PASSWORD } from './import.command.const.js';
import { cityCoordinates } from '../../const.js';
import ConfigService from '../config/config.service.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private logger: LoggerInterface;
  private configService: ConfigService;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.configService = new ConfigService(this.logger);
    this.userService = new UserService(this.logger, UserModel);
    this.offerService = new OfferService(this.logger, OfferModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: RentalOffer) {

    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    const coordinates: CityCoordinates = cityCoordinates[offer.city];

    await this.offerService.create({
      ...offer,
      coordinates,
      userId: user.id,
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const defaulDbPort = this.configService.get('DB_PORT');
    const uri = getMongoURI(login, password, host, defaulDbPort, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    fileReader.read()
      .catch((err) => {
        console.log(`Can't read the file: ${getErrorMessage(err)}`);
        throw new Error(err);
      });
  }
}
