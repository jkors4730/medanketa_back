import { User } from '../db/models/User.js';
import type { NextFunction, Request, Response } from 'express';

export const checkNotBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Пользователь не авторизован' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return;
    }

    if (user.dataValues.isBlocked) {
      res.status(403).json({ error: 'Пользователь заблокирован' });
      return;
    }

    next();
    return;
  } catch (error) {
    next(error);
  }
};
