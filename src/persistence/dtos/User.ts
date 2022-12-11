import { Source } from '@domain/Document';

export interface IUserPersistenceDTO {
  id: string;
  name: string;
  surname: string;
  role: string;
  password: string;
  email: string;
  sources_of_interest?: Source[];
}
