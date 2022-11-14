import * as bcrypt from 'bcrypt';
import { injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';

export interface UserTokenClaims {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class EncryptionService {
  public hash(data: string | Buffer, saltRounds = 10): string {
    return bcrypt.hashSync(data, saltRounds);
  }

  public compare(data: string, hash: string): boolean {
    return bcrypt.compareSync(data, hash);
  }

  public sign<TClaims extends object>(claims: TClaims): string {
    // todo config service for reading env vars

    console.log('exp time ', process.env.JWT_EXPIRATION_TIME);
    return jwt.sign(claims, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
  }

  public verify<TClaims extends object>(token: string): TClaims {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string, { complete: false });
    return decodedToken as TClaims;
  }
}
