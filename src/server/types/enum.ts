export enum TYPES_ENUM {
  // Env Vars
  CONFIG_SERVICE = 'CONFIG_SERVICE',

  // Connections
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',

  // REPOSITORIES
  USER_REPOSITORY = 'IUserRepository',
  RESET_PASSWORD_TOKEN_REPOSITORY = 'IResetPasswordTokenRepository',

  // CONTROLLERS
  USER_CONTROLLER = 'UserController',
  AUTH_CONTROLLER = 'AuthController',

  // MAPPERS
  USER_MAP = 'UserMap',
  RESET_PASSWORD_TOKEN_MAP = 'ResetPasswordTokenMap',

  // SERVICES
  USER_SERVICE = 'UserService',
  AUTH_SERVICE = 'AuthService',
  EMAIL_SERVICE = 'EmailService',
  ENCRYPTION_SERVICE = 'EncryptionService',
}
