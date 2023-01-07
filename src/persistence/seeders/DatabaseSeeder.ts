import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Role } from '@domain/User';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {
  UserSchema as User,
  DocumentSchema as Document,
  ProjectSchema as Project
} from '@persistence';
import { Source, Status } from '@domain/Document';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {

    const admin = em.create(User, {
      surname: 'admin',
      name: 'Role',
      email: 'admin@anap.ro',
      role: Role.ITA,
      password: bcrypt.hashSync('parola', 10),
    })

    const itaUser = em.create(User, {
      surname: 'Popescu',
      name: 'Ion',
      email: 'ion@anap.ro',
      role: Role.ITA,
      password: bcrypt.hashSync('parola', 10),
    })

    const lseUser = em.create(User, {
      surname: 'Ionescu',
      name: 'Vasile',
      email: 'vasile@anap.ro',
      role: Role.LSE,
      password: bcrypt.hashSync('parola', 10),
    })

    const lssUser = em.create(User, {
      surname: 'Lupu',
      name: 'Mioara',
      email: 'mioara@anap.ro',
      role: Role.LSS,
      password: bcrypt.hashSync('parola', 10),
    })


    const project = em.create(Project, {
      title: 'Proiect de ordin Natura 2000',
      presentsInterest: true,
      numarInregistrareSenat: 'L1/08.01.2021',
      numarInregistrareGuvern: 'E2743/30.12.2020',
      proceduraLegislativa: 'cf. Constitutiei revizuita in 2003',
      cameraDecizionala: 'Camera Deputatilor',
      termenAdoptare: '30 de zile pentru Senat ca prima Camera sesizata',
      tipInitiativa: 'Proiect de lege pentru aprobarea O.U.G.  nr. 213/2020',
      caracter: 'ordinar',
      esteProceduraDeUrgenta: false,
      initiator: 'Guvern',
      consultati: 'fisa de Senat',
      attachments: [],
    })

    const documentNou = em.create(Document, {
      title: 'Proiect de ordin Natura 2000',
      identifier: 'E274/30.12.2020',
      publicationDate: new Date(),
      source: Source.SENAT,
      status: Status.NOU,
      isRulesBreaker: false,
      project: project.id,
    })

    const documentRevizuit = em.create(Document, {
      title: 'Documet de lege privind decorarea persoanelor nascute la aceasta data',
      identifier: 'E274/19.03.1990',
      publicationDate: new Date(),
      source: Source.SENAT,
      status: Status.REVIZUIT,
      isRulesBreaker: false,
      project: project.id,
    })

    const documentInAnaliza = em.create(Document, {
      title: 'Legea numarul 20 din data 12 05 2020',
      identifier: 'E274/12.05.2020',
      publicationDate: new Date(),
      source: Source.SENAT,
      status: Status.NOU,
      isRulesBreaker: false,
      project: project.id,
    })

  }

}
