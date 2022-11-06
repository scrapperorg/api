import { v4 } from 'uuid';
import { TYPES } from '../../server/types/index';
import { EmailService } from './Email.service';
import { ForgotPasswordEmail } from '../../domain/Email/ForgotPassword.email';
import { ResetPasswordTokenMap } from '../mappers/ResetPasswordToken.map';
import { IUserRepository } from '../../domain/User';
import { IResetPasswordTokenRepository } from '../../domain/ResetPasswordToken';
import { UserMap } from '../mappers/User.map';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @inject(TYPES.RESET_PASSWORD_TOKEN_REPOSITORY)
    private readonly resetPasswordTokenRepository: IResetPasswordTokenRepository,
    @inject(TYPES.USER_MAP) private readonly userMap: UserMap,
    @inject(TYPES.RESET_PASSWORD_TOKEN_MAP)
    private readonly resetPasswordTokenMap: ResetPasswordTokenMap,
    @inject(TYPES.EMAIL_SERVICE) private readonly emailService: EmailService,
  ) {}

  async generateResetPasswordToken(userEmail: string) {
    const user = await this.userRepository.getByEmail(userEmail);
    if (!user) return null;
    const id = v4();
    const token = v4();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    this.resetPasswordTokenRepository.save({
      id,
      userId: user.id,
      expirationDate,
      token,
    });
    const email = ForgotPasswordEmail.create({
      from: '',
      to: '',
      title: 'forgot password',
      params: {
        token,
      },
    });
    this.emailService.send(email);
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
