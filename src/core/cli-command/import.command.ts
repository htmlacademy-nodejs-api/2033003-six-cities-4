import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from '../../const.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import { UserModel } from '../../modules/user/user.entity.js';
import UserService from '../../modules/user/user.service.js';
import { RentalOffer } from '../../types/rental-offer.type.js';
import MongoClientService from '../database-client/database-client.service.js';
import { DatabaseClientInterface } from '../database-client/mongo-client.interface.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { getErrorMessage } from '../helpers/common.js';
import { getMongoURI } from '../helpers/db.js';
import { createOffer } from '../helpers/offers.js';
import ConsoleLoggerService from '../logger/console.service.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import type { CliCommandInterface } from './cli-command.interface.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  //private offerService!: OfferServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    //this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: RentalOffer) {
    const categories = [];
    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    for (const {name} of offer.categories) {
      const existCategory = await this.categoryService.findByCategoryNameOrCreate(name, {name});
      categories.push(existCategory.id);
    }

    await this.offerService.create({
      ...offer,
      categories,
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
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
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
