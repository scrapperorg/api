import { NoSuchElementException, UnauthorizedException } from './../../lib';
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

    if (!user) {
      throw new NoSuchElementException('user not found');
    }

    const id = v4();
    const token = v4();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);

    const resetPasswordToken = await this.resetPasswordTokenRepository.save({
      id,
      user: user.id,
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

    return this.resetPasswordTokenMap.toDTO(resetPasswordToken);
  }

  async validateResetPasswordToken(token: string) {
    const resetPasswordToken = await this.resetPasswordTokenRepository.getByToken(token);

    if (resetPasswordToken === null) {
      throw new NoSuchElementException('Reset Password Token not found');
    }

    if (resetPasswordToken?.isExpired) {
      throw new NoSuchElementException('Reset Password Token is expired'); // todo: think of a better expception
    }

    return true;
  }

  async resetUserPassword(token: string, password: string) {
    const resetPasswordToken = await this.resetPasswordTokenRepository.getByToken(token);
    if (!resetPasswordToken) {
      throw new NoSuchElementException('Reset Password Token not found');
    }

    if (resetPasswordToken?.isExpired) {
      throw new NoSuchElementException('Reset Password Token is expired');
    }

    const user = await this.userRepository.getById(resetPasswordToken.user);

    if (!user) {
      throw new NoSuchElementException('User for Reset Password Token not found');
    }

    const hashedPassword = this.encryptionService.hash(password);
    user.updatePassword(hashedPassword);

    await this.userRepository.update(this.userMap.toPersistence(user));

    await this.expireResetPasswordToken(token);
  }

  async expireResetPasswordToken(tokenValue: string) {
    const resetPasswordToken = await this.resetPasswordTokenRepository.getByToken(tokenValue);

    if (!resetPasswordToken) {
      throw new NoSuchElementException('Reset Password Token not found');
    }

    resetPasswordToken.expire();

    await this.resetPasswordTokenRepository.update(resetPasswordToken);
  }
}
