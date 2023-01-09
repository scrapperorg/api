import { Migration } from '@mikro-orm/migrations';

export class Migration20230109150308 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "project" ("id" uuid not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "title" text not null, "presents_interest" boolean not null default false, "numar_inregistrare_senat" varchar(255) null, "numar_inregistrare_guvern" varchar(255) null, "procedura_legislativa" varchar(255) null, "camera_decizionala" varchar(255) null, "termen_adoptare" varchar(255) null, "tip_initiativa" varchar(255) null, "caracter" varchar(255) null, "este_procedura_de_urgenta" boolean not null default false, "stadiu" varchar(255) null, "initiator" varchar(255) null, "consultati" varchar(255) null, "attachments" text[] not null default \'{}\', constraint "project_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" uuid not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "name" varchar(255) not null, "surname" varchar(255) not null, "role" text check ("role" in (\'ITA\', \'LSE\', \'LSS\', \'GU\')) not null default \'GU\', "email" varchar(255) not null, "password" varchar(255) not null, "sources_of_interest" text[] not null default \'{}\', constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "reset_password_token" ("id" varchar(255) not null, "user_id" uuid not null, "token" varchar(255) not null, "expiration_date" timestamptz(0) not null, constraint "reset_password_token_pkey" primary key ("id"));');

    this.addSql('create table "document" ("id" uuid not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "title" text not null, "identifier" varchar(255) not null, "publication_date" timestamptz(0) not null, "source" varchar(255) not null, "status" text check ("status" in (\'nou\', \'in analiza\', \'revizuit\')) not null default \'nou\', "assigned_user_id" uuid null, "project_id" uuid not null, "deadline" timestamptz(0) null, "is_rules_breaker" boolean null default false, "original_format" varchar(255) null, "number_of_pages" int null, "text_interpretation_precision" int null, "number_of_identified_articles" int null, "number_of_identified_terms" int null, "attachments" text[] not null default \'{}\', constraint "document_pkey" primary key ("id"));');

    this.addSql('alter table "reset_password_token" add constraint "reset_password_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "document" add constraint "document_assigned_user_id_foreign" foreign key ("assigned_user_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "document" add constraint "document_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "document" drop constraint "document_project_id_foreign";');

    this.addSql('alter table "reset_password_token" drop constraint "reset_password_token_user_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_assigned_user_id_foreign";');

    this.addSql('drop table if exists "project" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "reset_password_token" cascade;');

    this.addSql('drop table if exists "document" cascade;');
  }

}
