import type { Request, Response, NextFunction } from 'express';
import type { JWTData } from '../utils/jwt.js';
import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith('Bearer')) {
    const token = auth.slice(7);

    try {
      const tokenData = verifyToken(token) as JWTData;
      req.body.tokenData = tokenData;
      req.user = tokenData;
      next();
    } catch (err) {
      console.error(err);
      res
        .json({
          error: 'jwt malformed',
        })
        .status(403);
    }
  } else {
    res
      .json({
        error: 'no token provided',
      })
      .status(403);
  }
};
