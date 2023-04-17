import { Migration } from '@mikro-orm/migrations';

export class Migration20230417111136 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "status" text check ("status" in (\'ACTIVE\', \'DELETED\')) not null default \'ACTIVE\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "status";');
  }

}
