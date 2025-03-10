import type { Request, Response } from 'express';
import { Service } from 'typedi';
import { validationResult } from 'express-validator';
import { Role } from '../db/models/Role.js';
import { ROLE_ADMIN, ROLE_INT, ROLE_RESP } from '../utils/common.js';
import { User } from '../db/models/User.js';
import { Op } from 'sequelize';
import { comparePassword, passwordHash } from '../utils/hash.js';
import { generateAuthToken } from '../utils/jwt.js';
import { returnError } from '../utils/error.js';
import { validateBirthDate } from '../utils/validateBirthDate.js';
import { UserRegistrationMessage } from '../services/interfaces/mail.interface.js';
import { MailService } from '../services/Mail.js';
import { UsersService } from '../services/users.service.js';
@Service()
export class AuthController {
  nodeMailer = new MailService();
  async registration(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const {
          name,
          lastName,
          surname,
          email,
          password,
          roleName,
          phone,
          birthDate,
          region,
          city,
          workPlace,
          specialization,
          position,
          workExperience,
          pdAgreement,
          newsLetterAgreement,
        } = req.body;
        if (birthDate) {
          if ((await validateBirthDate(birthDate)) === false) {
            res.send(403).json(`Сайт предназначен для лиц старше 18 лет`);
            return;
          }
        }
        const exists = await UsersService.findOneUser(email);

        if (exists) {
          returnError(null, res, [
            'Пользователь с таким email уже существует!',
          ]);
        }
        const user = await UsersService.create({
          name,
          lastName,
          surname,
          email,
          password,
          roleName,
          phone,
          birthDate,
          region,
          city,
          workPlace,
          specialization,
          position,
          workExperience,
          pdAgreement,
          newsLetterAgreement,
        });
        if (!user) {
          returnError(null, res, [
            `ошибка на сервере! пользователь не создан, попробуйте позже`,
          ]);
        }
        res.status(201).json(user.toJSON());
        const message: UserRegistrationMessage = {
          name: user.dataValues.name,
          email: user.dataValues.email,
          password: password,
          platform: 'medanketa.com',
          dateReg: user.dataValues.createdAt,
        };
        this.nodeMailer.sendAdminRegistrationMail(message);
        this.nodeMailer.sendUserRegistrationMail(
          user.dataValues.email,
          message,
        );
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res, [], 404);
    }
  }
  async login(req: Request, res: Response, admin: boolean): Promise<void> {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { email, password } = req.body;

        const adminRole = await Role.findOne({
          where: {
            guardName: ROLE_ADMIN,
          },
        });
        const jsonRole = adminRole ? adminRole.toJSON() : {};
        const exists = await User.findOne<any>({
          where: {
            email: email,
            roleId: { [!admin ? Op.not : Op.eq]: jsonRole.id },
          },
        });
        console.log('exists', exists?.toJSON());

        if (exists) {
          const validPassword = comparePassword(password, exists.password);

          if (validPassword) {
            const role = await Role.findByPk<any>(parseInt(exists.roleId));
            const token = await generateAuthToken(exists);
            if (role) {
              res.send({
                token: token,
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
