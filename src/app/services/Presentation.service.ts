import { inject, injectable } from 'inversify';
import { IUserAPIincomingDTO, IUserAPIDTO, ChangePasswordDTO } from '@controllers/dtos/User';
import { UserTokenClaims } from './Encryption.service';
import { TYPES } from '@server/types';
import { IUserRepository, Role, User, UserStatus } from '@domain/User';
import { NoSuchElementException } from '@lib';
import { IDocumentRepository, Source } from '@domain/Document';
import { RobotService } from './Robot.service';
import { IProjectRepository } from '@domain';
import { RobotStatus } from '@domain/Robot';
@injectable()
export class PresentationService {
  constructor(
    @inject(TYPES.DOCUMENT_REPOSITORY) private documentsRepository: IDocumentRepository,
    @inject(TYPES.ROBOT_SERVICE) private robotsService: RobotService,
    @inject(TYPES.PROJECT_REPOSITORY) private readonly projectRepository: IProjectRepository,
  ) {}

  async getMonitorCardsListData(): Promise<{
    documentsCount: number;
    robotsCount: number;
    failedRobotsCount: number;
    projectsCount: number;
  }> {
    const documentsCountPromise = this.documentsRepository.countNewDocuments();
    const projectsCountPromise = this.projectRepository.countNewProjects();
    const robotsCountPromise = this.robotsService.getAll();

    const [documentsCount, projectsCount, robots] = await Promise.all([
      documentsCountPromise,
      projectsCountPromise,
      robotsCountPromise,
    ]);

    return {
      documentsCount,
      projectsCount,
      robotsCount: robots.length,
      failedRobotsCount: robots.filter((robot) => robot.status === RobotStatus.NOT_FUNCTIONAL)
        .length,
    };
  }
}
