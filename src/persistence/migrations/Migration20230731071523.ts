import { Migration } from '@mikro-orm/migrations';

export class Migration20230731071523 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" add column "url" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop column "url";');
  }

}
