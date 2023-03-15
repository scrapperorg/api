import { Migration } from '@mikro-orm/migrations';

export class Migration20230315213042 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" drop constraint if exists "document_processing_status_check";');

    this.addSql('alter table "document" alter column "processing_status" type text using ("processing_status"::text);');
    this.addSql('alter table "document" add constraint "document_processing_status_check" check ("processing_status" in (\'downloaded\', \'locked\', \'ocr_in_progress\', \'ocr_done\', \'ocr_failed\', \'failed\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop constraint if exists "document_processing_status_check";');

    this.addSql('alter table "document" alter column "processing_status" type text using ("processing_status"::text);');
    this.addSql('alter table "document" add constraint "document_processing_status_check" check ("processing_status" in (\'downloaded\', \'locked\', \'ocr_in_progress\', \'ocr_done\', \'ocr_failed\'));');
  }

}
