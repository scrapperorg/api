import { Request, Response } from 'express';
import { EncryptionService, UserTokenClaims } from '@services/Encryption.service';

export async function isTrustedSource(request: Request, response: Response, next: () => void) {
  const token = request.headers['authorization'];

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!token) {
    return response.sendStatus(401);
  }

  try {
    if (token === process.env.TRUSTED_SOURCE_TOKEN) {
      next();
    } else {
      return response.sendStatus(401);
    }
  } catch (e) {
    console.log(e);
    return response.sendStatus(401);
  }
}
