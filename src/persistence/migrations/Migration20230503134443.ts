import { Migration } from '@mikro-orm/migrations';

export class Migration20230503134443 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" add column "numar_inregistrare_cdep" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop column "numar_inregistrare_cdep";');
  }

}
