
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { KeywordsSeeder } from "./KeywordsSeeder";
import { UsersSeeder } from "./UsersSeeder";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [UsersSeeder, KeywordsSeeder]);
  }
}
