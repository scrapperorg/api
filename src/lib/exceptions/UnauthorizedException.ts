import { Exception } from '.';

export class UnauthorizedException extends Error {
  key = Exception.UNAUTHORIZED_EXCEPTION;
  constructor(message: string | undefined) {
    super(message);
  }
}
