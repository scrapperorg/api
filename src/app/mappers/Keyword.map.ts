import { injectable } from 'inversify';
import { Keyword } from '@domain/Keyword';
import { IKeywordOutgoingDTO } from '@controllers/dtos/Keyword';

@injectable()
export class KeywordMap {
  toDTO(keyword: Keyword): IKeywordOutgoingDTO {
    const dtoObject = {
      id: keyword.id,
      createdAt: keyword.createdAt,
      updatedAt: keyword.updatedAt,
      name: keyword.name,
    };

    return dtoObject;
  }
}
