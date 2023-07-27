import { Migration } from '@mikro-orm/migrations';

export class Migration20230727093314 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" drop column "attachments";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" add column "attachments" text[] not null default \'{}\';');
  }

}
