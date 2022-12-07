import { Migration } from '@mikro-orm/migrations';

export class Migration20221120100312 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "document" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "project" varchar(255) not null, "identifier" varchar(255) not null, "publication_date" timestamptz(0) not null, "source" varchar(255) not null, "status" text[] not null default \'{nou}\', "assigned_user_id" varchar(255) null, "deadline" timestamptz(0) null, "original_format" varchar(255) null, "number_of_pages" int null, "text_interpretation_precision" int null, "number_of_identified_articles" int null, "number_of_identified_terms" int null, "attachments" text[] not null default \'{}\', constraint "document_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "document" add constraint "document_assigned_user_id_foreign" foreign key ("assigned_user_id") references "user" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "document" cascade;');
  }
}
