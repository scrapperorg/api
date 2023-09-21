import PgBoss from 'pg-boss';

export class JobSchedulerClient {
  static connect(pgConfig: PgBoss.ConstructorOptions): PgBoss {
    return new PgBoss(pgConfig);
  }
}
