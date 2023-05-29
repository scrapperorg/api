export interface Job<T = object> {
  id: string;
  name: string;
  data: T;
}

export interface IQueueService {
  subscribeHandler<HandlerParams>(
    queueName: string,
    handler: (job: Job<HandlerParams>) => Promise<void>,
  ): Promise<void>;

  addJob(queueName: string, data: any): Promise<void>;

  scheduleJob(queueName: string, data: any, date: Date): Promise<void>;

  cancelJob(id: string): Promise<void>;

  cancelJobsOnQueue(queueName: string): Promise<void>;
}
