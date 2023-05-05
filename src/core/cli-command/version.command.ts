import { promises } from 'node:fs';

import chalk from 'chalk';

import type { CliCommandInterface } from './cli-command.interface.js';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  private async readVersion(): Promise<string> {
    const contentPageJSON = await promises.readFile('./package.json', 'utf-8');
    const {version} = JSON.parse(contentPageJSON);
    return version;
  }

  public async execute(): Promise<void> {
    const version = await this.readVersion();
    console.log(chalk.green(version));
  }
}
