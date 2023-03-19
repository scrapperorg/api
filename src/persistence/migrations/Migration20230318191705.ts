import { Migration } from '@mikro-orm/migrations';

export class Migration20230318191705 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" add column "highlight_file" varchar(255) null, add column "highlight_metadata" jsonb null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop column "highlight_file";');
    this.addSql('alter table "document" drop column "highlight_metadata";');
  }

}
