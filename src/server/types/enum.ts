export enum TYPES_ENUM {
  // Connections
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',

  // REPOSITORIES
  USER_REPOSITORY = 'IUserRepository',
  RESET_PASSWORD_TOKEN_REPOSITORY = 'IResetPasswordTokenRepository',
  DOCUMENT_REPOSITORY = 'IDocumentRepository',

  // CONTROLLERS
  USER_CONTROLLER = 'UserController',
  AUTH_CONTROLLER = 'AuthController',
  DOCUMENT_CONTROLLER = 'DocumentController',

  // MAPPERS
  USER_MAP = 'UserMap',
  RESET_PASSWORD_TOKEN_MAP = 'ResetPasswordTokenMap',
  DOCUMENT_MAP = 'DocumentMap',

  // SERVICES
  USER_SERVICE = 'UserService',
  AUTH_SERVICE = 'AuthService',
  EMAIL_SERVICE = 'EmailService',
  ENCRYPTION_SERVICE = 'EncryptionService',
  DOCUMENT_SERVICE = 'DocumentService',
}
