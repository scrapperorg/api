import { Migration } from '@mikro-orm/migrations';

export class Migration20230625203607 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" add column "publication_date" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop column "publication_date";');
  }

}
