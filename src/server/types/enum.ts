export enum TYPES_ENUM {
  // Connections
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',
  ELASTIC_SEARCH_CONNECTION = 'ELASTIC_SEARCH_CONNECTION',

  // REPOSITORIES
  USER_REPOSITORY = 'IUserRepository',
  RESET_PASSWORD_TOKEN_REPOSITORY = 'IResetPasswordTokenRepository',
  DOCUMENT_REPOSITORY = 'IDocumentRepository',
  DOCUMENT_ELASTIC_REPOSITORY = 'IDocumentElasticRepository',
  PROJECT_REPOSITORY = 'IProjectRepository',
  PROJECT_ELASTIC_REPOSITORY = 'IProjectElasticRepository',
  ATTACHMENT_REPOSITORY = 'AttachmentRepository',
  ROBOT_REPOSITORY = 'RobotRepository',

  // CONTROLLERS
  USER_CONTROLLER = 'UserController',
  AUTH_CONTROLLER = 'AuthController',
  DOCUMENT_CONTROLLER = 'DocumentController',
  PROJECT_CONTROLLER = 'ProjectController',
  ATTACHMENT_CONTROLLER = 'AttachmentController',
  ROBOT_CONTROLLER = 'RobotController',

  // MAPPERS
  USER_MAP = 'UserMap',
  ROBOT_MAP = 'RobotMap',
  RESET_PASSWORD_TOKEN_MAP = 'ResetPasswordTokenMap',
  DOCUMENT_MAP = 'DocumentMap',
  PROJECT_MAP = 'ProjectMap',
  ATTACHMENT_MAP = 'AttachmentMap',

  // SERVICES
  USER_SERVICE = 'UserService',
  AUTH_SERVICE = 'AuthService',
  EMAIL_SERVICE = 'EmailService',
  ROBOT_SERVICE = 'RobotService',
  ENCRYPTION_SERVICE = 'EncryptionService',
  DOCUMENT_SERVICE = 'DocumentService',
  PROJECT_SERVICE = 'ProjectService',
  FILE_REPOSITORY_SERVICE = 'FileRepositoryService',
  ATTACHMENT_SERVICE = 'AttachmentService',
}
