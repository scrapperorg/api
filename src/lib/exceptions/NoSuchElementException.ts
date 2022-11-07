import { Exception } from './';

export class NoSuchElementException extends Error {
  key = Exception.NO_SUCH_ELEMENT_EXECEPTION;
  constructor(message: string | undefined) {
    super(message);
  }
}
