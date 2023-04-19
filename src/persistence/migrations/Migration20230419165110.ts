import { Migration } from '@mikro-orm/migrations';

export class Migration20230419165110 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" alter column "initiator" type text using ("initiator"::text);');
    this.addSql('alter table "project" alter column "consultati" type text using ("consultati"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" alter column "initiator" type varchar(255) using ("initiator"::varchar(255));');
    this.addSql('alter table "project" alter column "consultati" type varchar(255) using ("consultati"::varchar(255));');
  }

}
