import { Exception } from '.';

export class UnauthorizedException extends Error {
  key = Exception.INVALID;
  constructor(message: string | undefined) {
    super(message);
  }
}
