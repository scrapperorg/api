import { Migration } from '@mikro-orm/migrations';

export class Migration20230111160820 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" add column "link" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop column "link";');
  }

}
