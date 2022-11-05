import {
  IResetPasswordTokenPersistenceDTO,
  ResetPasswordToken,
  IResetPasswordTokenAPIDTO,
} from './../../domain/ResetPasswordToken';

export class ResetPasswordTokenMap {
  toPersistence(resetPasswordToken: ResetPasswordToken): IResetPasswordTokenPersistenceDTO {
    return {
      id: resetPasswordToken.id,
      userId: resetPasswordToken.userId,
      token: resetPasswordToken.token,
      expirationDate: resetPasswordToken.expirationDate,
    };
  }
  persistenceToDomain(resetPasswordToken: IResetPasswordTokenPersistenceDTO): ResetPasswordToken {
    return ResetPasswordToken.create(resetPasswordToken);
  }
  toDTO(resetPasswordToken: ResetPasswordToken): IResetPasswordTokenAPIDTO {
    return {
      userId: resetPasswordToken.userId,
      token: resetPasswordToken.token,
    };
  }
}
