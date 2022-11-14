import { Exception } from '.';

export class InvalidException extends Error {
  key = Exception.INVALID;
  constructor(message: string | undefined) {
    super(message);
  }
}
