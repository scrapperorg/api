export interface IUserAPIDTO {
  id: string;
  name: string;
  surname: string;
  role: string;
  email: string;
}

export interface IUserAPIincomingDTO extends Omit<IUserAPIDTO, 'id'> {
  password: string;
}
