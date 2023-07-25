import { Migration } from '@mikro-orm/migrations';

export class Migration20230725195426 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "attachment" add column "project_id" uuid null;');
    this.addSql('alter table "attachment" add constraint "attachment_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "attachment" drop constraint "attachment_project_id_foreign";');
    this.addSql('alter table "attachment" drop column "project_id";');
  }

}
