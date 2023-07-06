import PgBoss from 'pg-boss';
import { inject, injectable } from 'inversify';
import { TYPES } from '@server/types';
import { MikroORM } from '@mikro-orm/core';
import { IQueueService } from './Queue.service.interface';

@injectable()
export class QueueService implements IQueueService {
  private queueManager: PgBoss;
  constructor(@inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM) {
    const connectionOptions = this.orm.config.getAll();
    const dbHost = process.env.DB_HOST;
    const { user, password, dbName, port } = connectionOptions;
    const dbpath = `postgres://${user}:${password}@${dbHost}:${port}/${dbName}`;
    this.queueManager = new PgBoss(dbpath);
  }

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
