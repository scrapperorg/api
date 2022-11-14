import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { inject, injectable } from 'inversify';
import { EntityRepository, MikroORM, wrap } from '@mikro-orm/core';
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
    const rpt = this.rptEM.create(resestPasswordTokenDTO);
    await this.rptEM.persistAndFlush(rpt);
    return this.resetPasswordTokenMap.persistenceToDomain(resestPasswordTokenDTO);
  }

  async update(
    resestPasswordTokenDTO: IResetPasswordTokenPersistenceDTO,
  ): Promise<ResetPasswordToken> {
    const resetPasswordToken = await this.rptEM.findOne({ id: resestPasswordTokenDTO.id });

    if (!resetPasswordToken) {
      throw new NoSuchElementException('Reset Password Token not found');
    }

    const updatedResetPasswordToken = wrap(resetPasswordToken).assign(resestPasswordTokenDTO, {
      mergeObjects: true,
    });
    await this.rptEM.flush();
    return this.resetPasswordTokenMap.persistenceToDomain(updatedResetPasswordToken);
  }

  async getAllByUserId(userId: string): Promise<ResetPasswordToken[]> {
    const resetPasswordTokens = await this.rptEM.find({ user: userId });
    return resetPasswordTokens.map((rpt) => this.resetPasswordTokenMap.persistenceToDomain(rpt));
  }

  async getByToken(token: string): Promise<ResetPasswordToken | null> {
    const resetPasswordToken = await this.rptEM.findOne({ token });
    if (!resetPasswordToken) return null;
    return this.resetPasswordTokenMap.persistenceToDomain(resetPasswordToken);
  }
}
