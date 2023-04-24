import { Keyword } from '@domain/Keyword/Keyword';

export interface IKeywordRepository {
  create(name: string): Promise<Keyword>;

  getAll(): Promise<Keyword[]>;

  delete(id: string): Promise<boolean>;

  update(id: string, name: string): Promise<Keyword>;
}
