export interface IResetPasswordTokenAPIDTO {
  userId: string;
  token: string;
}

export interface IResetPasswordTokenPersistenceDTO {
  id: string;
  userId: string;
  token: string;
  expirationDate: Date;
}

export interface IResetPasswordTokenReepository {
  save(resestPasswordToken: IResetPasswordTokenPersistenceDTO): Promise<boolean|Error>
  getAllByUserId(userId: string): Promise<IResetPasswordTokenPersistenceDTO[]|null>
}