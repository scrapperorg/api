import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { ResetPasswordTokenMap } from '../../app/mappers/ResetPasswordToken.map';
import {
  IResetPasswordTokenPersistenceDTO,
  IResetPasswordTokenRepository,
} from '@domain/ResetPasswordToken';

@injectable()
export class ResetPasswordTokenTestRepository implements IResetPasswordTokenRepository {
  constructor(
    @inject(TYPES.RESET_PASSWORD_TOKEN_MAP)
    private readonly resetPasswordTokenMap: ResetPasswordTokenMap,
  ) {}

  private dummmytokens: Array<IResetPasswordTokenPersistenceDTO> = [
    {
      id: '1',
      userId: '1',
      token: 'giberishtoken',
      expirationDate: new Date(),
    },
  ];

  async save(resestPasswordToken: IResetPasswordTokenPersistenceDTO): Promise<boolean | Error> {
    return Promise.resolve(true);
  }

  async getAllByUserId(userId: string): Promise<IResetPasswordTokenPersistenceDTO[] | null> {
    return this.dummmytokens.map((rpt) => this.resetPasswordTokenMap.persistenceToDomain(rpt));
  }
}
