import { inject, injectable } from 'inversify';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { TYPES } from './../../server/types/index';
import { ResetPasswordTokenMap } from './../../app/mappers/ResetPasswordToken.map';
import { ResetPasswordTokenSchema } from './ResetPasswordToken.schema';
import {
  IResetPasswordTokenRepository,
  IResetPasswordTokenPersistenceDTO,
} from './../../domain/ResetPasswordToken/ResetPasswordToken.repository.interface';
import { ResetPasswordToken } from '../../domain/ResetPasswordToken';

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
  async save(
    resestPasswordTokenDTO: IResetPasswordTokenPersistenceDTO,
  ): Promise<ResetPasswordToken> {
    this.rptEM.create(resestPasswordTokenDTO);
    await this.rptEM.persistAndFlush(resestPasswordTokenDTO);
    return this.resetPasswordTokenMap.persistenceToDomain(resestPasswordTokenDTO);
  }
  async getAllByUserId(userId: string): Promise<ResetPasswordToken[]> {
    const resetPasswordTokens = await this.rptEM.find({ userId });
    return resetPasswordTokens.map((rpt) => this.resetPasswordTokenMap.persistenceToDomain(rpt));
  }
  async getByToken(token: string): Promise<ResetPasswordToken | null> {
    const resetPasswordToken = await this.rptEM.findOne({ token });
    if (!resetPasswordToken) return null;
    return this.resetPasswordTokenMap.persistenceToDomain(resetPasswordToken);
  }
}
