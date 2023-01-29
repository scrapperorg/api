import { Migration } from '@mikro-orm/migrations';

export class Migration20230129150921 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "attachment" ("id" uuid not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "name" text not null, "size" int not null, "path" text not null, "document_id" uuid null, constraint "attachment_pkey" primary key ("id"));');

    this.addSql('alter table "attachment" add constraint "attachment_document_id_foreign" foreign key ("document_id") references "document" ("id") on update cascade on delete set null;');

    this.addSql('alter table "document" drop column "attachments";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "attachment" cascade;');

    this.addSql('alter table "document" add column "attachments" text[] not null default \'{}\';');
  }

}
