import { Migration } from '@mikro-orm/migrations';

export class Migration20221205090325 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "sources_of_interest" text[] not null default \'{}\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "sources_of_interest";');
  }

}
