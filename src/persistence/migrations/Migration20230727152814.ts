import { Migration } from '@mikro-orm/migrations';

export class Migration20230727152814 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "notification" drop constraint if exists "notification_type_check";');

    this.addSql('alter table "notification" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "notification" add constraint "notification_type_check" check ("type" in (\'GENERIC\', \'NEW_DOCUMENT\', \'NEW_ASSIGNMENT\', \'DEADLINE_APPROACHING\', \'DEADLINE_REACHED\', \'DEADLINE_PASSED\', \'RESET_PASSWORD\', \'ROBOT_NOT_FUNCTIONAL\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "notification" drop constraint if exists "notification_type_check";');

    this.addSql('alter table "notification" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "notification" add constraint "notification_type_check" check ("type" in (\'GENERIC\', \'NEW_DOCUMENT\', \'NEW_ASSIGNMENT\', \'DEADLINE_APPROACHING\', \'DEADLINE_REACHED\', \'DEADLINE_PASSED\', \'RESET_PASSWORD\'));');
  }

}
