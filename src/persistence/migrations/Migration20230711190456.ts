import { Migration } from '@mikro-orm/migrations';

export class Migration20230711190456 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_status_check";');

    this.addSql('alter table "notification" drop constraint if exists "notification_type_check";');

    this.addSql('alter table "user" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "user" add constraint "user_status_check" check ("status" in (\'ACTIVE\', \'DELETED\', \'REQUESTED_PASSWORD_CHANGE\'));');

    this.addSql('alter table "notification" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "notification" add constraint "notification_type_check" check ("type" in (\'GENERIC\', \'NEW_DOCUMENT\', \'NEW_ASSIGNMENT\', \'DEADLINE_APPROACHING\', \'DEADLINE_REACHED\', \'DEADLINE_PASSED\', \'RESET_PASSWORD\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_status_check";');

    this.addSql('alter table "notification" drop constraint if exists "notification_type_check";');

    this.addSql('alter table "user" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "user" add constraint "user_status_check" check ("status" in (\'ACTIVE\', \'DELETED\'));');

    this.addSql('alter table "notification" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "notification" add constraint "notification_type_check" check ("type" in (\'GENERIC\', \'NEW_DOCUMENT\', \'NEW_ASSIGNMENT\', \'DEADLINE_APPROACHING\', \'DEADLINE_REACHED\', \'DEADLINE_PASSED\'));');
  }

}
