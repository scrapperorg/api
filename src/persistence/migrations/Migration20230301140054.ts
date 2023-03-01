import { Migration } from '@mikro-orm/migrations';

export class Migration20230301140054 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" add column "processing_status" text check ("processing_status" in (\'downloaded\', \'locked\', \'ocr_in_progress\', \'ocr_done\', \'ocr_failed\')) not null default \'downloaded\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop column "processing_status";');
  }

}
