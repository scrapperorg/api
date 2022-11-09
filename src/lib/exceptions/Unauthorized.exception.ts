import { Exception } from '.';

export class UnauthorizedException extends Error {
  key = Exception.UNAUTHORIZED;
  constructor(message: string | undefined) {
    super(message);
  }
}
