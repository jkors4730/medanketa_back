import type { NextFunction } from 'express';

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: any, res: any, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}
