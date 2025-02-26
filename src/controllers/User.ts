import type { Request, Response } from 'express';
import { returnError } from '../utils/error.js';
import { validationResult } from 'express-validator';
import { Service } from 'typedi';
import { UsersService } from '../services/users.service.js';
import { validateBirthDate } from '../utils/validate.birthDate.js';

@Service()
export class UserController {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        if ((await validateBirthDate(req.body.birthDate)) === false) {
          res.send(403).json(`Сайт предназначен для лиц старше 18 лет`);
          return;
        }
        const user = await UsersService.createUser(req.body);
        res.send(201).json(`user created`);
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const users = await UsersService.getAllUsers();
      res.json(users);
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;

        const user = await UsersService.getOneUser(parseInt(id), {
          attributes: { exclude: ['password'] },
        });

        if (!user) {
          returnError(null, res, [`User with id = ${id} not found`]);
        } else {
          res.status(200).json(user.toJSON());
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;
        const user = await UsersService.getOneUser(parseInt(id));

        if (!user) {
          returnError(null, res, [`User with id = ${id} not found`]);
        } else {
          await UsersService.updateUser(parseInt(id), { ...req.body });

          res.status(200).json(user.toJSON());
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;

        const user = await UsersService.getOneUser(parseInt(id));

        if (!user) {
          returnError(null, res, ['Not found'], 404);
        } else {
          await UsersService.deleteUser(+id);
          res.status(204).send();
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
}
