export interface IElasticDocument {
  title: string;
  post_ocr_content: string;
}

export interface IElasticDocumentRepository {
  indexOrUpdate(id: string, dto: IElasticDocument): Promise<void>;
}
