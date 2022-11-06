import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';

export class DatabaseClient {
  public connect = async (): Promise<MikroORM<IDatabaseDriver<Connection>> | void> => {
    try {
      return MikroORM.init();
    } catch (error) {
      console.log(error);
    }
  };
}
