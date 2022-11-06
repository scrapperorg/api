export enum TYPES_ENUM {
  // Connections
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',

  // REPOSITORIES
  USER_REPOSITORY = 'IUserRepository',
  RESET_PASSWORD_TOKEN_REPOSITORY = 'IResetPasswordTokenRepository',

  // CONTROLLERS
  USER_CONTROLLER = 'UserController',

  // MAPPERS
  USER_MAP = 'UserMap',
  RESET_PASSWORD_TOKEN_MAP = 'ResetPasswordTokenMap',

  // SERVICES
  USER_SERVICE = 'UserService',
  RESET_PASSWORD_SERVICE = 'ResetPasswordService',
  EMAIL_SERVICE = 'EmailService',
}
