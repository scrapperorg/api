import { Request, Response } from 'express';
import { Role } from '@domain/User';

export function isAuthorized() {
  return (request: Request, response: Response, next: () => void) => {
    const userId = request.params.id;
    const loggedInUserId = request.user?.id;

    if (loggedInUserId === userId || request.user?.role === Role.ITA) {
      next();
    } else {
      return response.status(403).json({ error: `User has not enough permissions.` });
    }
  };
}
