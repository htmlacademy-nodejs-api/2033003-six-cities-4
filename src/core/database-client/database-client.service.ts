import { setTimeout } from 'node:timers/promises';

import { inject, injectable } from 'inversify';
import mongoose, { Mongoose } from 'mongoose';

import { AppComponent } from '../../types/app-component.enum.js';
import type { DatabaseClientInterface } from './mongo-client.interface.js';
import type { LoggerInterface } from '../logger/logger.interface.js';
import { RETRY_COUNT, RETRY_TIMEOUT } from './database-client.const.js';

@injectable()
export default class MongoClientService implements DatabaseClientInterface {
  private isConnected = false;
  private mongooseInstance: Mongoose | null = null;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  private connectWithRetry(uri: string): Promise<Mongoose> {
    let attempt = 0;

    const tryConnect = (): Promise<Mongoose> => {
      if (attempt >= RETRY_COUNT) {
        this.logger.error(`Unable to establish database connection after ${attempt} attempts.`);
        throw new Error('Failed to connect to the database');
      }

      return mongoose.connect(uri)
        .catch(async () => {
          attempt++;
          this.logger.error(`Failed to connect to the database. Attempt ${attempt}`);
          await setTimeout(RETRY_TIMEOUT);
          return tryConnect();
        });
    };

    return tryConnect();
  }

  private async performConnect(uri:string): Promise<void> {
    return this.connectWithRetry(uri)
      .then((mongooseInstance) => {
        this.mongooseInstance = mongooseInstance;
        this.isConnected = true;
      })
      .catch((error) => {
        this.logger.error('Failed to connect to the database in connect function');
        throw error;
      });
  }

  private async performDisconnect(): Promise<void> {
    await this.mongooseInstance?.disconnect();
    this.isConnected = false;
    this.mongooseInstance = null;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      this.logger.info('MongoDB client already connected, reusing the connection.');
      return;
    }

    this.logger.info('Trying to connect to MongoDB…');
    await this.performConnect(uri);
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to the database');
    }

    await this.performDisconnect();
    this.logger.info('Database connection closed.');
  }
}
