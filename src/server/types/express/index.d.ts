import { UserTokenClaims } from '@services/Encryption.service';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserTokenClaims;
    }
  }
}
