import {NextFunction, Request, Response} from 'express';
import {nanoid} from 'nanoid';
import multer, {diskStorage} from 'multer';
import mime from 'mime-types';

import type{MiddlewareInterface} from '../../types/middleware.interface.js';

enum AllowedFileExtensions {
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
}

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  private isFileExtensionAllowed(filename: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension !== undefined && Object.values(AllowedFileExtensions).includes(extension as AllowedFileExtensions);
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      },
    });

    const uploadSingleFileMiddleware = multer({
      storage,
      fileFilter: (_req, file, callback) => {
        if (this.isFileExtensionAllowed(file.originalname)) {
          return callback(null, true);
        } else {
          return callback(new Error('Bad Request - Invalid file extension'));
        }
      },
    }).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
