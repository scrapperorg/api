import { BaseEntity } from './../BaseEntity/BaseEntity';
import { Source } from '@domain/Document';
import { OptionalProps } from '@mikro-orm/core';

export enum Role {
  ITA = 'ITA', // IT Administrator
  LSE = 'LSE', // Legislation Screening Expert
  LSS = 'LSS', // Legislation Screening Supervisor
  GU = 'GU', // Generic User
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  REQUESTED_PASSWORD_CHANGE = 'REQUESTED_PASSWORD_CHANGE',
}

export interface IUserProps {
  name: string;
  surname: string;
  role: Role;
  password: string;
  email: string;
  sources_of_interest?: Source[];
  status?: UserStatus;
  avatar?: string;
}

export class User extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'sourcesOfInterest' | 'status' | 'avatar';

  name: string;
  surname: string;
  role: Role;
  email: string;
  password: string;
  sourcesOfInterest: Source[];
  status: UserStatus;
  avatar: string | undefined;

  constructor(props: IUserProps) {
    super();
    this.name = props.name;
    this.surname = props.surname;
    this.role = props.role;
    this.email = props.email;
    this.password = props.password;
    this.sourcesOfInterest = props.sources_of_interest ?? [];
    this.status = props.status ?? UserStatus.ACTIVE;
    this.avatar = props.avatar;
  }

  /**
   * Get the input role and return an existing role.
   * If no role found, return the role with the least rights: GU
   * @param role
   */
  static matchRole(role: string): Role {
    if (role in Role) {
      return (<any>Role)[role as keyof Role];
    }
    return Role.GU;
  }
}
