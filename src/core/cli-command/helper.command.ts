import chalk from 'chalk';

import type { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  //TODO: npm run ts ./src/main.ts  -- --import ./mocks/mock-data.tsv admin test localhost six-cities secret изменить описание импорта
  public async execute(): Promise<void> {
    console.log(chalk.yellow(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            ${chalk.green('--version')}:                   # Выводит номер версии приложения
            ${chalk.green('--help')}:                      # Печатает этот текст
            ${chalk.green('--import <path>')}:             # Импортирует в базу данных информацию из tsv-файла. Путь к файлу передаётся в параметре <path>.
            ${chalk.green('--generate <n> <path> <url>')}:  # Создаёт файл в формате tsv с тестовыми данными. Параметр <n> задаёт количество генерируемых предложений. Параметр <path> указывает путь для сохранения файла с предложениями. Параметр <url> задаёт адрес сервера, с которого необходимо взять данные
    `));
  }
}
