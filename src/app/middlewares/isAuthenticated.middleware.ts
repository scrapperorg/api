import { Request, Response } from 'express';
import { EncryptionService } from '@services/Encryption.service';

export default async function isAuthenticated(encryptionService: EncryptionService) {
  return (request: Request, response: Response, next: () => void) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader != null && authHeader.split(' ')[1];

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!token) {
      return response.sendStatus(401);
    }

    try {
      const claims = encryptionService.verify(token);
      next();
    } catch {
      return response.sendStatus(401);
    }
  };
}
