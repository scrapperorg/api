import { BaseEntity } from './../BaseEntity/BaseEntity';
import { Source } from '@domain/Document';
import { OptionalProps } from '@mikro-orm/core';

export enum Role {
  ITA = 'ITA', // IT Administrator
  LSE = 'LSE', // Legislation Screening Expert
  LSS = 'LSS', // Legislation Screening Supervisor
  GU = 'GU', // Generic User
}

export interface IUserProps {
  name: string;
  surname: string;
  role: string;
  password: string;
  email: string;
  sources_of_interest?: Source[];
}

export class User extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'sourcesOfInterest';

  name: string;
  surname: string;
  role: string;
  email: string;
  password: string;
  sourcesOfInterest: Source[];

  constructor(props: IUserProps) {
    super();
    this.name = props.name;
    this.surname = props.surname;
    this.role = props.role;
    this.email = props.email;
    this.password = props.password;
    this.sourcesOfInterest = props.sources_of_interest ?? [];
  }
}
