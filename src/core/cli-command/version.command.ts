import { promises } from 'node:fs';

import chalk from 'chalk';

import type { CliCommandInterface } from './cli-command.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import ConsoleLoggerService from '../logger/console.service.js';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';
  private logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  private async readVersion(): Promise<string> {
    const contentPageJSON = await promises.readFile('./package.json', 'utf-8');
    const {version} = JSON.parse(contentPageJSON);
    return version;
  }

  public async execute(): Promise<void> {
    const version = await this.readVersion();
    this.logger.info(chalk.green(version));
  }
}
