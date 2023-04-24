import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IKeywordRepository, Keyword } from '@domain/Keyword';
import { IKeywordOutgoingDTO } from '@controllers/dtos/Keyword';
import { KeywordMap } from '@mappers/Keyword.map';

@injectable()
export class KeywordService {
  constructor(
    @inject(TYPES.KEYWORD_REPOSITORY)
    private readonly keywordRepository: IKeywordRepository,
    @inject(TYPES.KEYWORD_MAP)
    private readonly keywordMap: KeywordMap,
  ) {}

  async create(name: string): Promise<IKeywordOutgoingDTO> {
    const keyword = await this.keywordRepository.create(name);
    return this.keywordMap.toDTO(keyword);
  }

  async getAll(): Promise<IKeywordOutgoingDTO[]> {
    const keywords = await this.keywordRepository.getAll();
    return keywords.map((k) => this.keywordMap.toDTO(k));
  }

  async delete(id: string): Promise<boolean> {
    return await this.keywordRepository.delete(id);
  }

  async update(id: string, name: string): Promise<IKeywordOutgoingDTO> {
    const keyword = await this.keywordRepository.update(id, name);
    return this.keywordMap.toDTO(keyword);
  }
}
