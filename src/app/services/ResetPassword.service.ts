import { ResetPasswordTokenMap } from './../mappers/ResetPasswordToken.map';
import { IUserRepository } from './../../domain/User';
import { IResetPasswordTokenReepository } from './../../domain/ResetPasswordToken';
import { UserMap } from 'app/mappers/User.map';

export class ResetPasswordService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly resetPasswordTokenRepository: IResetPasswordTokenReepository,
    private readonly userMap: UserMap,
    private readonly resetPasswordTokenMap: ResetPasswordTokenMap
  ) {}

  async generateResetPasswordToken(userEmail: string) {
    // get user
    // create reset password token for user with expiration
    // send email with url containint reset-password-token
  }

  async validateResetPasswordToken() {
    // get reset password token
    // check if expiry date pasted
    // if not exists or expired return 400
    // else return 200
  }

  async resetUserPassword() {
    // get user by token
    // hash new password
    // update user with hashed password
  }
}