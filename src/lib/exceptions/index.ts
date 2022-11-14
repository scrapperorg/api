export * from './NoSuchElement.exception';
export * from './Unauthorized.exception';
export * from './Validation.exception';

export enum Exception {
  NO_SUCH_ELEMENT = 'NoSuchElementException',
  UNIQUE_CONSTRAINT_VIOLATION = 'UniqueConstraintViolationException',
  UNAUTHORIZED = 'UnauthorizedException',
  INVALID = 'InvalidException',
}
