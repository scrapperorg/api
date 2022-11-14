import { v4 } from 'uuid';
import { TYPES } from '@server/types';
import { EmailService } from './Email.service';
import { ForgotPasswordEmail } from '@domain/Email';
import { ResetPasswordTokenMap } from '../mappers/ResetPasswordToken.map';
import { IUserRepository, User } from '@domain/User';
import { IResetPasswordTokenRepository } from '@domain/ResetPasswordToken';
import { UserMap } from '../mappers/User.map';
import { inject, injectable } from 'inversify';
import { EncryptionService } from './Encryption.service';

export class NoSuchElementException extends Error {
  key = 'NO_SUCH_ELEMENT_EXECEPTION';
  constructor(message: string | undefined) {
    super(message);
  }
}

export class UnauthorizedException extends Error {
  key = 'UNAUTHORIZED_EXCEPTION';
  constructor(message: string | undefined) {
    super(message);
  }
}

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
    @inject(TYPES.ENCRYPTION_SERVICE) private readonly encryptionService: EncryptionService,
  ) {}

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new NoSuchElementException('user not found');
    }

    const passwordMatch = this.encryptionService.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('password does not match');
    }

    const token = this.encryptionService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { user, token };
  }

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
