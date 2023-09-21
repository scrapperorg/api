import PgBoss from 'pg-boss';
import { inject, injectable } from 'inversify';
import { TYPES } from '@server/types';
import { IQueueService } from './Queue.service.interface';

@injectable()
export class QueueService implements IQueueService {
  constructor(@inject(TYPES.JOB_SCHEDULER_CONNECTION) private readonly queueManager: PgBoss) {}

  async startQueueManager() {
    await this.queueManager.start();
  }

  async subscribeHandler<HandlerParams>(
    queueName: string,
    handler: (job: PgBoss.Job<HandlerParams>) => Promise<void>,
  ) {
    try {
      await this.queueManager.work(queueName, handler);

      this.queueManager.onComplete(queueName, (job: PgBoss.Job) => {
        console.log(`Completed job on queue ${queueName}: ${job.id} / ${job.name}`);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addJob(queueName: string, data: any) {
    try {
      await this.queueManager.send(queueName, data);
    } catch (error) {
      console.log(error);
    }
  }

  async scheduleJob(queueName: string, data: any, date: Date) {
    try {
      await this.queueManager.sendAfter(queueName, data, {}, date);
    } catch (error) {
      console.log(error);
    }
  }

  async cancelJob(id: string) {
    try {
      await this.queueManager.cancel(id);
      console.log(`Cancelled job ${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  async cancelJobsOnQueue(queueName: string) {
    try {
      await this.queueManager.deleteQueue(queueName);
      console.log(`Cancelled jobs on queue ${queueName}`);
    } catch (error) {
      console.log(error);
    }
  }
}
