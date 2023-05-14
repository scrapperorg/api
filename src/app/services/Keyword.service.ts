import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IKeywordRepository, Keyword } from '@domain/Keyword';
import { IKeywordOutgoingDTO } from '@controllers/dtos/Keyword';
import { KeywordMap } from '@mappers/Keyword.map';
import { EncryptionService } from '@services/Encryption.service';

@injectable()
export class KeywordService {
  constructor(
    @inject(TYPES.KEYWORD_REPOSITORY)
    private readonly keywordRepository: IKeywordRepository,
    @inject(TYPES.KEYWORD_MAP)
    private readonly keywordMap: KeywordMap,
    @inject(TYPES.ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(name: string): Promise<IKeywordOutgoingDTO> {
    const keyword = await this.keywordRepository.create(name);
    return this.keywordMap.toDTO(keyword);
  }

  async getAll(withHash = false): Promise<[IKeywordOutgoingDTO[], string]> {
    const keywords = await this.keywordRepository.getAll();
    let hash = '';
    if (withHash) {
      const stringOfKeywords = keywords.reduce((str: string, keyword) => {
        return str + keyword.name;
      }, '');
      hash = this.encryptionService.deterministicHash(stringOfKeywords);
    }
    return [keywords.map((k) => this.keywordMap.toDTO(k)), hash];
  }

  async delete(id: string): Promise<boolean> {
    return await this.keywordRepository.delete(id);
  }

  async update(id: string, name: string): Promise<IKeywordOutgoingDTO> {
    const keyword = await this.keywordRepository.update(id, name);
    return this.keywordMap.toDTO(keyword);
  }
}
