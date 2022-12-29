import { Migration } from '@mikro-orm/migrations';

export class Migration20221229142750 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" add column "numar_inregistrare_senat" varchar(255) null, add column "numar_inregistrare_guvern" varchar(255) null, add column "procedura_legislativa" varchar(255) null, add column "camera_decizionala" varchar(255) null, add column "termen_adoptare" varchar(255) null, add column "tip_initiativa" varchar(255) null, add column "caracter" varchar(255) null, add column "este_procedura_de_urgenta" boolean not null default false, add column "stadiu" varchar(255) null, add column "initiator" varchar(255) null, add column "consultati" varchar(255) null, add column "attachments" text[] not null default \'{}\';');

    this.addSql('alter table "user" alter column "sources_of_interest" type text[] using ("sources_of_interest"::text[]);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop column "numar_inregistrare_senat";');
    this.addSql('alter table "project" drop column "numar_inregistrare_guvern";');
    this.addSql('alter table "project" drop column "procedura_legislativa";');
    this.addSql('alter table "project" drop column "camera_decizionala";');
    this.addSql('alter table "project" drop column "termen_adoptare";');
    this.addSql('alter table "project" drop column "tip_initiativa";');
    this.addSql('alter table "project" drop column "caracter";');
    this.addSql('alter table "project" drop column "este_procedura_de_urgenta";');
    this.addSql('alter table "project" drop column "stadiu";');
    this.addSql('alter table "project" drop column "initiator";');
    this.addSql('alter table "project" drop column "consultati";');
    this.addSql('alter table "project" drop column "attachments";');

    this.addSql('alter table "user" alter column "sources_of_interest" type text[] using ("sources_of_interest"::text[]);');
  }

}
