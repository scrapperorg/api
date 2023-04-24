import { injectable } from 'inversify';
import { IKeywordRepository, Keyword } from '@domain/Keyword';

@injectable()
export class KeywordMockRepository implements IKeywordRepository {
  create(name: string): Promise<Keyword> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<Keyword[]> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  update(id: string, name: string): Promise<Keyword> {
    throw new Error('Method not implemented.');
  }
}
