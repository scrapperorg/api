import { Migration } from '@mikro-orm/migrations';

export class Migration20230423163125 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "keyword" ("id" uuid not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "name" text not null, constraint "keyword_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "keyword" cascade;');
  }

}
