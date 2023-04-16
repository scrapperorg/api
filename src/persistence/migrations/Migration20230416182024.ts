import { Migration } from '@mikro-orm/migrations';

export class Migration20230416182024 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" add column "ocr_file" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop column "ocr_file";');
  }

}
