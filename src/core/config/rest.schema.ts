import convict from 'convict';
import validator from 'convict-format-with-validator';

import { EnvConfig } from './../../app/rest.const.js';


convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  MONGO_INITDB_ROOT_USERNAME: string;
  MONGO_INITDB_ROOT_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  UPLOAD_DIRECTORY: string;
  JWT_SECRET:string;
  EXPIRATION_TIME: string;
  HOST: string;
  STATIC_DIRECTORY_PATH: string;
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: EnvConfig.PORT,
    default: null
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: EnvConfig.SALT,
    default: null
  },
  DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: EnvConfig.DB_HOST,
    default: null
  },
  MONGO_INITDB_ROOT_USERNAME: {
    doc: 'Username to connect to the database',
    format: String,
    env: EnvConfig.MONGO_INITDB_ROOT_USERNAME,
    default: null,
  },
  MONGO_INITDB_ROOT_PASSWORD: {
    doc: 'Password to connect to the database',
    format: String,
    env: EnvConfig.MONGO_INITDB_ROOT_PASSWORD,
    default: null,
  },
  DB_PORT: {
    doc: 'Port to connect to the database (MongoDB)',
    format: 'port',
    env: EnvConfig.DB_PORT,
    default: '27017',
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: EnvConfig.DB_NAME,
    default: null
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for upload files',
    format: String,
    env: EnvConfig.UPLOAD_DIRECTORY,
    default: null
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT',
    format: String,
    env: EnvConfig.JWT_SECRET,
    default: null
  },
  EXPIRATION_TIME: {
    doc: 'Time duration for token expiration',
    format: String,
    env: EnvConfig.EXPIRATION_TIME,
    default: null
  },
  HOST: {
    doc: 'Host wrere started service',
    format: String,
    env: EnvConfig.HOST,
    default: 'localhost'
  },
  STATIC_DIRECTORY_PATH: {
    doc: 'Path to directory with static files',
    format: String,
    env: EnvConfig.STATIC_DIRECTORY_PATH,
    default: null
  }
});
