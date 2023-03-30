import { Migration } from '@mikro-orm/migrations';

export class Migration20230328061528 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" drop constraint if exists "document_status_check";');

    this.addSql('alter table "user" alter column "sources_of_interest" type text[] using ("sources_of_interest"::text[]);');

    this.addSql('alter table "document" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "document" add constraint "document_status_check" check ("status" in (\'nou\', \'in_analiza\', \'revizuit\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop constraint if exists "document_status_check";');

    this.addSql('alter table "user" alter column "sources_of_interest" type text[] using ("sources_of_interest"::text[]);');

    this.addSql('alter table "document" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "document" add constraint "document_status_check" check ("status" in (\'nou\', \'in analiza\', \'revizuit\'));');
  }

}
