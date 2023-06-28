export const DEFAULT_STATIC_IMAGES = [
  'default-avatar.jpg',
];

export const STATIC_RESOURCE_FIELDS = [
  'avatar',
  'previewImage',
  'images'
];

export enum RestRoute {
  USERS = '/users',
  OFFERS = '/offers',
  COMMENTS = '/comments',
  UPLOAD = '/upload',
  STATIC = '/static',
}

export enum EnvConfig {
  UPLOAD_DIRECTORY = 'UPLOAD_DIRECTORY',
  STATIC_DIRECTORY_PATH = 'STATIC_DIRECTORY_PATH',
  MONGO_INITDB_ROOT_USERNAME = 'MONGO_INITDB_ROOT_USERNAME',
  MONGO_INITDB_ROOT_PASSWORD = 'MONGO_INITDB_ROOT_PASSWORD',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_NAME = 'DB_NAME',
  HOST = 'HOST',
  PORT = 'PORT',
  SALT = 'SALT',
  JWT_SECRET = 'JWT_SECRET',
  EXPIRATION_TIME = 'EXPIRATION_TIME'
}

export enum PopulateField {
  UserId = 'userId',
  OfferId = 'offerId'
}
