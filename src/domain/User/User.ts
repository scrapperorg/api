export enum Role {
  LSE = 'LSE', // Legislation Screening Expert
  LSS = 'LSS', // Legislation Screening Supervisor
  ITA = 'ITA', // IT Administrator
  GU = 'GU' // Generic User
}

export interface IUserProps {
  id?: string
  name: string
  surname: string
  role: string
}

export class User{
  name: string
  id: string
  surname: string
  role: string
  private constructor(
    props: IUserProps
  ) {
    this.name = props.name
    this.id = props.id ?? 'random generated string'
    this.surname = props.surname
    this.role = props.role
  }
  
  public static create(props: IUserProps) {
    //validate if necessary
    return new User(props)
  }

}