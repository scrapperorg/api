export interface IElasticProject {
  id: string;
  title: string;
  created_at: string;
  numar_inregistrare_senat: string;
  numar_inregistrare_guvern: string;
  presents_interest: boolean;
}

export interface ProjectElasticSearchProps {
  title?: string;
  createdAfter?: string;
  createdBefore?: string;
  postOcrContent?: string;
  presentsInterest?: boolean;
}

export interface IElasticProjectRepository {
  search(query: ProjectElasticSearchProps): Promise<IElasticProject[]>;
}
