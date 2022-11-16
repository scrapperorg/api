import { Request, Response } from 'express';
import { EncryptionService } from '@services/Encryption.service';

export async function isAuthenticated(request: Request, response: Response, next: () => void) {
  const token = request.headers['authorization'];

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!token) {
    return response.sendStatus(401);
  }

  try {
    const encryptionService = new EncryptionService();
    request.user = encryptionService.verify(token);
    next();
  } catch (e) {
    console.log(e);
    return response.sendStatus(401);
  }
}
