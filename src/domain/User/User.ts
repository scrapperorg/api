export enum Role {
  LSE = 'LSE', // Legislation Screening Expert
  LSS = 'LSS', // Legislation Screening Supervisor
  ITA = 'ITA', // IT Administrator
  GU = 'GU' // Generic User
}

export interface IUser {
  id: string;
  name: string;
  surname: string;
  role: Role;
}

export class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public surname: string,
    public role: Role,
  ) {
    //
  }
}