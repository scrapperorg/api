import { Migration } from '@mikro-orm/migrations';

export class Migration20221104135833 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "reset_password_token" ("id" varchar(255) not null, "user_id" varchar(255) not null, "token" varchar(255) not null, "expiration_date" timestamptz(0) not null, constraint "reset_password_token_pkey" primary key ("id"));');

    this.addSql('alter table "reset_password_token" add constraint "reset_password_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "reset_password_token" cascade;');
  }

}
