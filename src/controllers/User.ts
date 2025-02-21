import type { Request, Response } from 'express';
import { UserModel } from '../db/models/User.js';
import { RoleModel } from '../db/models/Role.js';
import { comparePassword, passwordHash } from '../utils/hash.js';
import { returnError } from '../utils/error.js';
import { generateAuthToken } from '../utils/jwt.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { ROLE_ADMIN } from '../utils/common.js';
import { Service } from 'typedi';
import { UsersService } from '../services/users.service.js';

@Service()
export class UserController {
  constructor(private readonly userService: UsersService) {}
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const user = await this.userService.createUser(req.body);
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
      const users = await this.userService.getAllUsers();
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

        const user = await this.userService.getOneUser(parseInt(id), {
          attributes: { exclude: ['password'] },
        });

        if (!user) {
          returnError(null, res, [`UserModel with id = ${id} not found`]);
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
        const user = await this.userService.getOneUser(parseInt(id));

        if (!user) {
          returnError(null, res, [`UserModel with id = ${id} not found`]);
        } else {
          await this.userService.updateUser(parseInt(id), { ...req.body });

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

        const user = await this.userService.getOneUser(parseInt(id));

        if (!user) {
          returnError(null, res, ['Not found'], 404);
        } else {
          await this.userService.deleteUser(+id);
          res.status(204).send();
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async login(req: Request, res: Response, admin = false) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { email, password } = req.body;

        const adminRole = await RoleModel.findOne<any>({
          where: {
            guardName: ROLE_ADMIN,
          },
        });

        const exists = await UserModel.findOne<any>({
          where: {
            email: email,
            roleId: { [!admin ? Op.not : Op.eq]: adminRole.id },
          },
        });
        console.log('exists', exists?.toJSON());

        if (exists) {
          const validPassword = comparePassword(password, exists.password);

          if (validPassword) {
            const role = await RoleModel.findByPk<any>(parseInt(exists.roleId));

            if (role) {
              res.send({
                token: generateAuthToken(exists),
                id: exists.id,
                name: exists.name,
                lastName: exists.lastName,
                email: exists.email,
                role: role.guardName,
              });
            } else {
              returnError(null, res, ['Роль пользователя не существует!']);
            }
          } else {
            returnError(null, res, ['Неправильный пароль!']);
          }
        } else {
          returnError(null, res, ['Пользователя с таким email не существует!']);
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
}
