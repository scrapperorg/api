import { Source } from '@domain/Document';

export enum Role {
  ITA = 'ITA', // IT Administrator
  LSE = 'LSE', // Legislation Screening Expert
  LSS = 'LSS', // Legislation Screening Supervisor
  GU = 'GU', // Generic User
}

export interface IUserProps {
  id?: string;
  name: string;
  surname: string;
  role: string;
  password: string;
  email: string;
  sourcesOfInterest?: Source[];
}

export class User {
  name: string;
  id: string;
  surname: string;
  role: string;
  email: string;
  password: string;
  sourcesOfInterest: Source[];
  private constructor(props: IUserProps) {
    this.name = props.name;
    this.id = props.id ?? 'random generated string';
    this.surname = props.surname;
    this.role = props.role;
    this.email = props.email;
    this.password = props.password;
    this.sourcesOfInterest = props.sourcesOfInterest ?? [];
  }

  public updatePassword(newPassword: string): void {
    this.password = newPassword;
  }

  public updateSources(newSources: Source[]): void {
    this.sourcesOfInterest = newSources;
  }

  public static create(props: IUserProps) {
    //validate if necessary
    return new User(props);
  }
}
