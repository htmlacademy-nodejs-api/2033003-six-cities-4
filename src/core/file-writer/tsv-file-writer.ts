import { WriteStream } from 'node:fs';
import { createWriteStream } from 'node:fs';
import EventEmitter from 'node:events';

import type { FileWriterInterface } from './file-writer.interface.js';
import { CHUNK_SIZE_WRITER } from './file-writer.const.js';

export default class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: CHUNK_SIZE_WRITER,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      await EventEmitter.once(this.stream, 'drain');
    }
  }
}
