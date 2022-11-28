import { inject, injectable } from 'inversify';
import { ConfigService } from '@server/config/ConfigService';
import { TYPES } from '@server/types';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export interface UserTokenClaims {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class EncryptionService {
  constructor(@inject(TYPES.CONFIG_SERVICE) private readonly configService: ConfigService) {}

  public hash(data: string | Buffer, saltRounds = 10): string {
    return bcrypt.hashSync(data, saltRounds);
  }

  public compare(data: string, hash: string): boolean {
    return bcrypt.compareSync(data, hash);
  }

  public sign<TClaims extends object>(claims: TClaims): string {
    return jwt.sign(claims, process.env.JWT_SECRET as string, {
      expiresIn: this.configService.getVar('JWT_EXPIRATION_TIME'),
    });
  }

  public verify<TClaims extends object>(token: string): TClaims {
    const decodedToken = jwt.verify(token, this.configService.getVar('JWT_SECRET'), {
      complete: false,
    });
    return decodedToken as TClaims;
  }
}
