import type { CliCommandInterface } from '../core/cli-command/cli-command.interface.js';

type ParsedCommand = Record<string, string[]>;

export default class CLIApplication {
  private commands: Record<string, CliCommandInterface> = {};
  private readonly defaultCommand = '--help';

  private parseCommand(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command: string;

    cliArguments.forEach((item) => {
      if (item.startsWith('--')) {
        command = item;
        parsedCommand[command] = [];
      } else if (command && item) {
        parsedCommand[command].push(item);
      }
    });

    return parsedCommand;
  }

  public getCommand(commandName: string): CliCommandInterface {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];

    command.execute(...commandArguments);
  }

  public registerCommands(commandList: CliCommandInterface[]): void {
    this.commands = commandList.reduce((acc, value) => ({
      ...acc,
      [value.name]: value
    }), {});
  }
}
