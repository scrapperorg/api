import { Request, Response } from 'express';
import { EncryptionService, UserTokenClaims } from '@services/Encryption.service';

export async function isAuthenticatedOrTrustedSource(
  request: Request,
  response: Response,
  next: () => void,
) {
  const token = request.headers['authorization'];

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!token) {
    return response.sendStatus(401);
  }

  if (token === process.env.TRUSTED_SOURCE_TOKEN) {
    return next();
  }

  try {
    const encryptionService = new EncryptionService();
    request.user = encryptionService.verify<UserTokenClaims>(token);
    next();
  } catch (e) {
    console.log(e);
    return response.sendStatus(401);
  }
}
