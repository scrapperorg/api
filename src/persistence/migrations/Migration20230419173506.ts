import { Migration } from '@mikro-orm/migrations';

export class Migration20230419173506 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" alter column "termen_adoptare" type text using ("termen_adoptare"::text);');
    this.addSql('alter table "project" alter column "tip_initiativa" type text using ("tip_initiativa"::text);');
    this.addSql('alter table "project" alter column "stadiu" type text using ("stadiu"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" alter column "termen_adoptare" type varchar(255) using ("termen_adoptare"::varchar(255));');
    this.addSql('alter table "project" alter column "tip_initiativa" type varchar(255) using ("tip_initiativa"::varchar(255));');
    this.addSql('alter table "project" alter column "stadiu" type varchar(255) using ("stadiu"::varchar(255));');
  }

}
