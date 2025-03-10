import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware для проверки доступа.
 * @param permission Разрешение, необходимое для выполнения эндпоинта.
 * @param resourceIdParam Опционально: имя параметра URL, содержащего id ресурса.
 */
export const requirePermission = (
  permission: string,
  resourceIdParam?: string,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Нет авторизации' });
      return;
    }
    if (
      user.permissions.includes('*') ||
      user.permissions.includes(permission)
    ) {
      next();
      return;
    } else {
      res.status(403).json({ error: 'Нет доступа к данному ресурсу' });
      return;
    }
    // if (resourceIdParam && user.role !== 'admin') {
    //   const targetId = Number(req.params[resourceIdParam]);
    //   if (targetId !== Number(user.id)) {
    //     res
    //       .status(403)
    //       .json({ error: 'Запрещено изменять данные другого пользователя' });
    //     return;
    //   }
    // }
    // next();
    // return;
  };
};
