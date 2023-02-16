import { Migration } from '@mikro-orm/migrations';

export class Migration20230212134053 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" add column "post_ocr_content" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop column "post_ocr_content";');
  }

}
