import { Request, Response } from 'express';
import { Role } from '@domain/User';

export const ROLES_PRIORITY = {
  [Role.GU]: 0,
  [Role.LSS]: 1,
  [Role.LSE]: 2,
  [Role.ITA]: 3,
};

export function hasRoleAtLeast(allowedRole: Role) {
  return (request: Request, response: Response, next: () => void) => {
    try {
      if (!request.user) {
        return response.status(403).json({ error: `User has not enough permissions.` });
      }
      if (ROLES_PRIORITY[request.user.role as Role] < ROLES_PRIORITY[allowedRole]) {
        return response.status(403).json({ error: `User has not enough permissions.` });
      }
      next();
    } catch (e) {
      console.log(e);
      return response.status(500).json({ error: 'Something wrong happened.' });
    }
  };
}

export function hasExactRole(allowedRole: Role) {
  return (request: Request, response: Response, next: () => void) => {
    try {
      if (!request.user) {
        return response.status(403).json({ error: `User has not enough permissions.` });
      }
      if (request.user.role !== allowedRole) {
        return response.status(403).json({ error: `User has not enough permissions.` });
      }
      next();
    } catch (e) {
      console.log(e);
      return response.status(500).json({ error: 'Something wrong happened.' });
    }
  };
}
