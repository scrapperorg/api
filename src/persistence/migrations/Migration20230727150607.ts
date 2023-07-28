import { Migration } from '@mikro-orm/migrations';

export class Migration20230727150607 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "avatar" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "avatar";');
  }

}
