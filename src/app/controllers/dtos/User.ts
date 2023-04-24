export interface IUserAPIDTO {
  id: string;
  createdAt: Date;
  name: string;
  surname: string;
  role: string;
  email: string;
  sourcesOfInterest?: string[];
  status: string;
}

export interface IUserAPIincomingDTO extends Omit<IUserAPIDTO, 'id' | 'createdAt' | 'status'> {
  password: string;
}

export interface ChangePasswordDTO {
  password: string;
  confirmPassword: string;
}
