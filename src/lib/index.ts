import { Exception } from './exceptions';
import { HttpStatus } from './HttpStatus';

type StatusMap = { [key in Exception]: HttpStatus };

export const statusMap: StatusMap = {
  [Exception.NO_SUCH_ELEMENT_EXECEPTION]: HttpStatus.NOT_FOUND,
  [Exception.UNAUTHORIZED_EXCEPTION]: HttpStatus.UNAUTHORIZED,
};

export * from './exceptions';
export * from './HttpStatus';
