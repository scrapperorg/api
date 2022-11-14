import { ResetPasswordToken } from './ResetPasswordToken';
export interface IResetPasswordTokenAPIDTO {
  userId: string;
  token: string;
}

export interface IResetPasswordTokenPersistenceDTO {
  id: string;
  user: string;
  token: string;
  expirationDate: Date;
}

export interface IResetPasswordTokenRepository {
  save(resestPasswordToken: IResetPasswordTokenPersistenceDTO): Promise<ResetPasswordToken>;
  update(resestPasswordToken: IResetPasswordTokenPersistenceDTO): Promise<ResetPasswordToken>;
  getAllByUserId(userId: string): Promise<ResetPasswordToken[]>;
  getByToken(token: string): Promise<ResetPasswordToken | null>;
}
