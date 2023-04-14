import { Migration } from '@mikro-orm/migrations';

export class Migration20230413110407 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" add column "decision" text check ("decision" in (\'fara_concluzie\', \'contravine_legislatiei\', \'adera_legislatiei\')) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop column "decision";');
  }

}
