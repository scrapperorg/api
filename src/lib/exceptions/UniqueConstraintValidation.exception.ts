import { Exception } from './';

export class UniqueConstraintViolationException extends Error {
  key = Exception.UNIQUE_CONSTRAINT_VIOLATION;
  constructor(message: string | undefined) {
    super(message);
  }
}
