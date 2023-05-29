import { injectable } from 'inversify';
import { IQueueService, Job } from './Queue.service.interface';

@injectable()
export class QueueMockService implements IQueueService {
  async subscribeHandler<HandlerParams>(
    queueName: string,
    handler: (job: Job<HandlerParams>) => Promise<void>,
  ): Promise<void> {
    return;
  }

  async addJob(queueName: string, data: any) {
    return;
  }

  async scheduleJob(queueName: string, data: any, date: Date) {
    return;
  }

  async cancelJob(id: string) {
    return;
  }

  async cancelJobsOnQueue(queueName: string) {
    return;
  }
}
