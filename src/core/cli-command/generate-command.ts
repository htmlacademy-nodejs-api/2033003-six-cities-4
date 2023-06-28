import got from 'got';

import { CliCommandInterface } from './cli-command.interface.js';
import { MockData } from '../../types/mock-data.js';
import OfferGenerator from '../../modules/offer-generator/offer-generator.js';
import TSVFileWriter from '../file-writer/tsv-file-writer.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import ConsoleLoggerService from '../logger/console.service.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;
  private logger: LoggerInterface;
  constructor(){
    this.logger = new ConsoleLoggerService();
  }

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    this.initialData = await got.get(url)
      .json()
      .then((data: unknown) => data as MockData)
      .catch((error) => {
        this.logger.error(`Can't fetch data from ${url}. ${error}`);
        return {} as MockData;
      });

    const offerGeneratorString = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }

    this.logger.error(`File ${filepath} was created!`);
  }
}
