export enum Role {
  LSE = 'LSE', // Legislation Screening Expert
  LSS = 'LSS', // Legislation Screening Supervisor
  ITA = 'ITA', // IT Administrator
  GU = 'GU', // Generic User
}

export interface IUserProps {
  id?: string;
  name: string;
  surname: string;
  role: string;
  password: string;
  email: string;
}

export class User {
  name: string;
  id: string;
  surname: string;
  role: string;
  email: string;
  password: string;
  private constructor(props: IUserProps) {
    this.name = props.name;
    this.id = props.id ?? 'random generated string';
    this.surname = props.surname;
    this.role = props.role;
    this.email = props.email;
    this.password = props.password;
  }

  public updatePassword(newPassword: string): void {
    this.password = newPassword;
  }

  public static create(props: IUserProps) {
    //validate if necessary
    return new User(props);
  }
}
