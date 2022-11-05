import { EmailService } from './Email.service';
import { ForgotPasswordEmail } from './../../domain/Email/ForgotPassword.email';
import { v4 } from 'uuid';
import { ResetPasswordTokenMap } from './../mappers/ResetPasswordToken.map';
import { IUserRepository } from './../../domain/User';
import { IResetPasswordTokenRepository } from './../../domain/ResetPasswordToken';
import { UserMap } from 'app/mappers/User.map';

export class ResetPasswordService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly resetPasswordTokenRepository: IResetPasswordTokenRepository,
    private readonly userMap: UserMap,
    private readonly resetPasswordTokenMap: ResetPasswordTokenMap,
    private readonly emailService: EmailService,
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
