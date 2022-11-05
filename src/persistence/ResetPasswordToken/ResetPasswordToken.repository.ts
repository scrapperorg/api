import { ResetPasswordTokenMap } from './../../app/mappers/ResetPasswordToken.map';
import { ResetPasswordTokenSchema } from './ResetPasswordToken.schema';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { IResetPasswordTokenRepository, IResetPasswordTokenPersistenceDTO } from './../../domain/ResetPasswordToken/ResetPasswordToken.repository.interface';

export class ResetPasswordTokenRepository implements IResetPasswordTokenRepository {
  private rptEM: EntityRepository<IResetPasswordTokenPersistenceDTO>
  constructor(private readonly orm: MikroORM, private readonly resetPasswordTokenMap: ResetPasswordTokenMap) {
    const em = this.orm.em.fork()
    this.rptEM = em.getRepository(ResetPasswordTokenSchema)
  }
  async save(resestPasswordTokenDTO: IResetPasswordTokenPersistenceDTO): Promise<boolean|Error> {
    const resetPasswordToken = this.rptEM.create(resestPasswordTokenDTO)
    return this.rptEM.persistAndFlush(resetPasswordToken)
      .then(() => true)
      .catch(err => new Error(err))
  }
  async getAllByUserId(userId: string): Promise<IResetPasswordTokenPersistenceDTO[] | null> {
    const resetPasswordTokens = await this.rptEM.find({ userId })
    return resetPasswordTokens.map(rpt => this.resetPasswordTokenMap.persistenceToDomain(rpt))

  }
}