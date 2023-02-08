import { Connection, FlushMode, IDatabaseDriver, MikroORM } from '@mikro-orm/core';

export class DatabaseClient {
  public connect = async (): Promise<MikroORM<IDatabaseDriver<Connection>> | void> => {
    try {
      return MikroORM.init({ flushMode: FlushMode.ALWAYS });
    } catch (error) {
      console.log(error);
    }
  };
}
