import { Migration } from '@mikro-orm/migrations';

export class Migration20221207143710 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "document" add column "is_rules_breaker" boolean not null default false;');
    this.addSql('alter table "document" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "document" add constraint "document_status_check" check ("status" in (\'nou\', \'in analiza\', \'revizuit\'));');
    this.addSql('alter table "document" alter column "status" set default \'nou\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop constraint if exists "document_status_check";');

    this.addSql('alter table "document" alter column "status" type text[] using ("status"::text[]);');
    this.addSql('alter table "document" alter column "status" set default \'{nou}\';');
    this.addSql('alter table "document" drop column "is_rules_breaker";');
  }

}
