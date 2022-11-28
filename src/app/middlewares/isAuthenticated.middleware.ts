import { Request, Response } from 'express';
import { EncryptionService, UserTokenClaims } from '@services/Encryption.service';
import { ConfigService } from '@server/config/ConfigService';

export async function isAuthenticated(request: Request, response: Response, next: () => void) {
  const token = request.headers['authorization'];

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!token) {
    return response.sendStatus(401);
  }

  try {
    const cs = new ConfigService();
    cs.loadVars();
    const encryptionService = new EncryptionService(cs);
    request.user = encryptionService.verify<UserTokenClaims>(token);
    next();
  } catch (e) {
    console.log(e);
    return response.sendStatus(401);
  }
}
