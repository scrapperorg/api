import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { TYPES } from '../../server/types/index';
import { inject, injectable } from 'inversify';
import { ResetPasswordTokenMap } from '../../app/mappers/ResetPasswordToken.map';
import {
  IResetPasswordTokenPersistenceDTO,
  IResetPasswordTokenRepository,
  ResetPasswordToken,
} from '../../domain/ResetPasswordToken';

@injectable()
export class ResetPasswordTokenTestRepository implements IResetPasswordTokenRepository {
  constructor(
    @inject(TYPES.RESET_PASSWORD_TOKEN_MAP)
    private readonly resetPasswordTokenMap: ResetPasswordTokenMap,
  ) {}

  private entries: Array<IResetPasswordTokenPersistenceDTO> = [
    {
      id: '1',
      user: '1',
      token: 'giberishtoken',
      expirationDate: new Date(),
    },
  ];

  async save(resestPasswordToken: IResetPasswordTokenPersistenceDTO): Promise<ResetPasswordToken> {
    this.entries.push(resestPasswordToken);
    return this.resetPasswordTokenMap.persistenceToDomain(resestPasswordToken);
  }

  async update(
    resestPasswordToken: IResetPasswordTokenPersistenceDTO,
  ): Promise<ResetPasswordToken> {
    const indexOfExistingEntry = this.entries.findIndex(
      (entry) => entry.id === resestPasswordToken.id,
    );
    if (indexOfExistingEntry === -1) {
      throw new NoSuchElementException('Reset Password Token not found');
    } else {
      this.entries[indexOfExistingEntry] = resestPasswordToken;
    }
    return this.resetPasswordTokenMap.persistenceToDomain(resestPasswordToken);
  }

  async getAllByUserId(userId: string): Promise<ResetPasswordToken[]> {
    return this.entries
      .filter((rpt) => rpt.user === userId)
      .map((rpt) => this.resetPasswordTokenMap.persistenceToDomain(rpt));
  }
  async getByToken(token: string): Promise<ResetPasswordToken | null> {
    const rptDTO = this.entries.find((rpt) => rpt.token === token ?? null);
    if (!rptDTO) return null;
    return this.resetPasswordTokenMap.persistenceToDomain(rptDTO);
  }
}
