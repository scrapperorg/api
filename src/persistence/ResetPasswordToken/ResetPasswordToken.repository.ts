import { inject, injectable } from 'inversify';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { TYPES } from '@server/types';
import { ResetPasswordTokenMap } from '../../app/mappers/ResetPasswordToken.map';
import { ResetPasswordTokenSchema } from './ResetPasswordToken.schema';
import {
  IResetPasswordTokenRepository,
  IResetPasswordTokenPersistenceDTO,
} from '@domain/ResetPasswordToken';

@injectable()
export class ResetPasswordTokenRepository implements IResetPasswordTokenRepository {
  private rptEM: EntityRepository<IResetPasswordTokenPersistenceDTO>;
  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.RESET_PASSWORD_TOKEN_MAP)
    private readonly resetPasswordTokenMap: ResetPasswordTokenMap,
  ) {
    const em = this.orm.em.fork();
    this.rptEM = em.getRepository(ResetPasswordTokenSchema);
  }
  async save(resestPasswordTokenDTO: IResetPasswordTokenPersistenceDTO): Promise<boolean | Error> {
    const resetPasswordToken = this.rptEM.create(resestPasswordTokenDTO);
    return this.rptEM
      .persistAndFlush(resetPasswordToken)
      .then(() => true)
      .catch((err) => new Error(err));
  }
  async getAllByUserId(userId: string): Promise<IResetPasswordTokenPersistenceDTO[] | null> {
    const resetPasswordTokens = await this.rptEM.find({ userId });
    return resetPasswordTokens.map((rpt) => this.resetPasswordTokenMap.persistenceToDomain(rpt));
  }
}
