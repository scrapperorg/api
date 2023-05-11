import { Migration } from '@mikro-orm/migrations';

export class Migration20230511103357 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "notification" ("id" uuid not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "message" varchar(255) not null, "type" text check ("type" in (\'GENERIC\', \'NEW_DOCUMENT\', \'NEW_ASSIGNMENT\', \'DEADLINE_APPROACHING\', \'DEADLINE_REACHED\', \'DEADLINE_PASSED\')) not null default \'GENERIC\', "user_id" uuid not null, "document_id" uuid null, "seen" boolean not null default false, constraint "notification_pkey" primary key ("id"));');

    this.addSql('alter table "notification" add constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "notification" add constraint "notification_document_id_foreign" foreign key ("document_id") references "document" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "notification" cascade;');
  }

}
