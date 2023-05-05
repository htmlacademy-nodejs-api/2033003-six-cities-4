#!/usr/bin/env node
import CLIApplication from './app/cli.js';
import HelpCommand from './core/cli-command/helper.command.js';
import ImportCommand from './core/cli-command/import.command.js';
import VersionCommand from './core/cli-command/version.command.js';

const cliApp = new CLIApplication();
cliApp.registerCommands([
  new HelpCommand, new VersionCommand, new ImportCommand,
]);
cliApp.processCommand(process.argv);
