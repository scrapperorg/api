import { Migration } from '@mikro-orm/migrations';

export class Migration20230208163933 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" add column "storage_path" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop column "storage_path";');
  }

}
