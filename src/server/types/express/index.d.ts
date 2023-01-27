import { IDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';
import { UserTokenClaims } from '@services/Encryption.service';
import { IProjectFilters } from '@middlewares/parseProjectsFilters.middleware';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserTokenClaims;
      documentsFilters?: IDocumentsFilters;
      projectsFilters?: IProjectFilters;
    }
  }
}
