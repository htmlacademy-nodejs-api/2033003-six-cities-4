import chalk from 'chalk';

import type { CliCommandInterface } from './cli-command.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import ConsoleLoggerService from '../logger/console.service.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';
  private logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  public async execute(): Promise<void> {
    this.logger.info(chalk.yellow(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            ${chalk.green('--version')}: # Выводит номер версии приложения
            ${chalk.green('--help')}:  # Печатает этот текст
            ${chalk.green('--import <path> <login> <password> <host> <dbname> <salt>')}: # Импортирует в базу данных информацию из tsv-файла. Путь к файлу передаётся в параметре <path>.
            ${chalk.green('--generate <n> <path> <url>')}:  # Создаёт файл в формате tsv с тестовыми данными. Параметр <n> задаёт количество генерируемых предложений. Параметр <path> указывает путь для сохранения файла с предложениями. Параметр <url> задаёт адрес сервера, с которого необходимо взять данные
    `));
  }
}
