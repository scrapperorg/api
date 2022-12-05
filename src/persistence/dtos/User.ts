export interface IUserPersistenceDTO {
  id: string;
  name: string;
  surname: string;
  role: string;
  password: string;
  email: string;
  sourcesOfInterest?: string[];
}
