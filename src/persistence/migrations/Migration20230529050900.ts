import { Migration } from '@mikro-orm/migrations';

export class Migration20230529050900 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" add column "publication_date" timestamptz(0) null, add column "url" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop column "publication_date";');
    this.addSql('alter table "project" drop column "url";');
  }

}
