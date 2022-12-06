import { Migration } from '@mikro-orm/migrations';

export class Migration20221206173640 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "project" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "presents_interest" boolean not null, constraint "project_pkey" primary key ("id"));');

    this.addSql('alter table "document" add column "project_id" uuid not null;');
    this.addSql('alter table "document" add constraint "document_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
    this.addSql('alter table "document" drop column "project";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop constraint "document_project_id_foreign";');

    this.addSql('drop table if exists "project" cascade;');

    this.addSql('alter table "document" add column "project" varchar(255) not null;');
    this.addSql('alter table "document" drop column "project_id";');
  }

}
