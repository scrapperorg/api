import { Migration } from '@mikro-orm/migrations';

export class Migration20230419170646 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" add column "source" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop column "source";');
  }

}
