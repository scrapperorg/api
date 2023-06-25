import { Migration } from '@mikro-orm/migrations';

export class Migration20230625195758 extends Migration {

  async up(): Promise<void> {
    this.addSql(`DELETE FROM keyword WHERE ctid NOT IN (SELECT min(ctid) FROM keyword GROUP BY name);`)
    this.addSql('alter table "keyword" add constraint "keyword_name_unique" unique ("name");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "keyword" drop constraint "keyword_name_unique";');
  }

}
