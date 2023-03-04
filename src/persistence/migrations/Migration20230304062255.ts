import { Migration } from '@mikro-orm/migrations';

export class Migration20230304062255 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" alter column "sources_of_interest" type text[] using ("sources_of_interest"::text[]);');

    this.addSql('alter table "document" add column "total_parts" int not null default 1, add column "part" int not null default 1;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop column "total_parts";');
    this.addSql('alter table "document" drop column "part";');

    this.addSql('alter table "user" alter column "sources_of_interest" type text[] using ("sources_of_interest"::text[]);');
  }

}
