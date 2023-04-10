import { injectable } from 'inversify';
import { Project, IElasticProject, IElasticProjectRepository } from '@domain/Project';

@injectable()
export class ProjectMockElasticRepository implements IElasticProjectRepository {
  private elasticProject: IElasticProject[] = [
    {
      project_id: 'id',
      title: 'title',
      created_at: '',
      numar_inregistrare_senat: '',
      numar_inregistrare_guvern: '',
      presents_interest: false,
    },
  ];

  async search(query: Partial<Project>) {
    return this.elasticProject;
  }
}
