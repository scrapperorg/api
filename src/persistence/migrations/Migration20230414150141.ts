import { Migration } from '@mikro-orm/migrations';

export class Migration20230414150141 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "robot" ("id" uuid not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "name" varchar(255) not null, "status" text check ("status" in (\'FUNCTIONAL\', \'NOT_FUNCTIONAL\')) not null, "last_run" timestamptz(0) not null, "info" text not null, constraint "robot_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "robot" cascade;');
  }

}
