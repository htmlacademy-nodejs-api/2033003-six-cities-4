import TSVFileReader from '../file-reader/tsv-file-reader.js';
import type { CliCommandInterface } from './cli-command.interface.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  public async execute(filename: string): Promise<void> {

    const fileReader = new TSVFileReader(filename.trim());

    try {
      await fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.log(`Не удалось импортировать данные из файла по причине: «${err.message}»`);
    }
  }
}