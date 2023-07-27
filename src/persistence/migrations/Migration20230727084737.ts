import { Migration } from '@mikro-orm/migrations';

export class Migration20230727084737 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" drop column "attachments";');

    this.addSql('alter table "user" alter column "sources_of_interest" type text[] using ("sources_of_interest"::text[]);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" add column "attachments" text[] not null default \'{}\';');

    this.addSql('alter table "user" alter column "sources_of_interest" type text[] using ("sources_of_interest"::text[]);');
  }

}
