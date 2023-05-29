import { Migration } from '@mikro-orm/migrations';

export class Migration20230529053432 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" alter column "publication_date" type varchar(255) using ("publication_date"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" alter column "publication_date" type timestamptz(0) using ("publication_date"::timestamptz(0));');
  }

}
