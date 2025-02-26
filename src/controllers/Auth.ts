import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Role } from '../db/models/Role.js';
import { ROLE_ADMIN } from '../utils/common.js';
import { User } from '../db/models/User.js';
import { Op } from 'sequelize';
import { comparePassword } from '../utils/hash.js';
import { generateAuthToken } from '../utils/jwt.js';
import { returnError } from '../utils/error.js';
import { AuthService } from '../services/auth.service.js';
//di
export class AuthController {
  async registration(req: Request, res: Response) {}
  async login(req: Request, res: Response, admin = false) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { email, password } = req.body;

        const adminRole = await Role.findOne<any>({
          where: {
            guardName: ROLE_ADMIN,
          },
        });

        const exists = await User.findOne<any>({
          where: {
            email: email,
            roleId: { [!admin ? Op.not : Op.eq]: adminRole.id },
          },
        });
        console.log('exists', exists?.toJSON());

        if (exists) {
          const validPassword = comparePassword(password, exists.password);

          if (validPassword) {
            const role = await Role.findByPk<any>(parseInt(exists.roleId));

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
  async logOut() {}
  async setBlockStatusUser(req: Request, res: Response) {
    const { userId, block } = req.query;
    const user = await AuthService.blockUser(userId, block);
    if (!user) {
      returnError(null, res, [`user not found`]);
    }
    res.status(200).json(user.message);
  }
}
