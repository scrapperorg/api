import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role } from "../../domain";
import * as bcrypt from 'bcrypt';
import { UserSchema } from "../User";

const users = [
  {
    surname: 'admin',
    name: 'Role',
    email: 'admin@anap.ro',
    role: Role.ITA,
    password: bcrypt.hashSync('parola', 10),
  },
  {
    surname: 'Popescu',
    name: 'Ion',
    email: 'ion@anap.ro',
    role: Role.ITA,
    password: bcrypt.hashSync('parola', 10),
  },
  {
    surname: 'Ionescu',
    name: 'Vasile',
    email: 'vasile@anap.ro',
    role: Role.LSE,
    password: bcrypt.hashSync('parola', 10),
  },
  {
    surname: 'Lupu',
    name: 'Mioara',
    email: 'mioara@anap.ro',
    role: Role.LSS,
    password: bcrypt.hashSync('parola', 10),
  }
];

export class UsersSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {

    users.forEach((user) => {
      em.create(UserSchema, user);
    });
  }
}
