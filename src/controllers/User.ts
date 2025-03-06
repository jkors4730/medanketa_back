/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { User } from '../db/models/User.js';
import { Role } from '../db/models/Role.js';
import { comparePassword, passwordHash } from '../utils/hash.js';
import { returnError } from '../utils/error.js';
import { generateAuthToken } from '../utils/jwt.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { ROLE_ADMIN, ROLE_INT, ROLE_RESP } from '../utils/common.js';
import { Service } from 'typedi';
import { validateBirthDate } from '../utils/validateBirthDate.js';
@Service()
export class UserController {
  async create(req: Request, res: Response) {
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
          newsletterAgreement,
        } = req.body;
        if ((await validateBirthDate(birthDate)) === false) {
          res.send(403).json(`Сайт предназначен для лиц старше 18 лет`);
          return;
        }
        const exists = await User.findOne({ where: { email: email } });
        console.log('exists', exists);

        if (!exists) {
          const mapping: Record<string, string> = {
            Интервьюер: ROLE_INT,
            Респондент: ROLE_RESP,
          };

          // find or create role
          const [role] = await Role.findOrCreate<any>({
            where: { guardName: mapping[roleName] },
            defaults: {
              name: roleName,
              guardName: mapping[roleName],
            },
          });

          console.log('Role', role.toJSON(), role.id);

          const hash = passwordHash(password);

          const user = User.build({
            name,
            email,
            lastName,
            surname,
            password: hash, // store hashed password in db
            roleId: role.id, // connect with role
            phone,
            birthDate,
            region,
            city,
            workPlace,
            specialization,
            position,
            workExperience,
            pdAgreement,
            newsletterAgreement,
          });

          console.log('User', user.toJSON());

          await user.save();

          res.status(201).json(user.toJSON());
        } else {
          returnError(null, res, [
            'Пользователь с таким email уже существует!',
          ]);
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const users = await User.findAll();

      res.json(users).status(200);
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;

        const user = await User.findByPk<any>(id, {
          attributes: { exclude: ['password'] },
        });

        if (user === null) {
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
          newsletterAgreement,
        } = req.body;

        const user = await User.findByPk<any>(parseInt(id));

        if (user === null) {
          returnError(null, res, [`User with id = ${id} not found`]);
        } else {
          user.name = typeof name == 'string' ? name : user.name;
          user.lastName =
            typeof lastName == 'string' ? lastName : user.lastName;
          user.surname = typeof surname == 'string' ? surname : user.surname;
          user.email = typeof email == 'string' ? email : user.email;
          user.password =
            typeof password == 'string' ? password : user.password;
          user.roleName =
            typeof roleName == 'string' ? roleName : user.roleName;
          user.phone = typeof phone == 'string' ? phone : user.phone;
          user.birthDate =
            typeof birthDate == 'string' ? birthDate : user.birthDate;
          user.region = typeof region == 'string' ? region : user.region;
          user.city = typeof city == 'string' ? city : user.city;
          user.workPlace =
            typeof workPlace == 'string' ? workPlace : user.workPlace;
          user.specialization =
            typeof specialization == 'string'
              ? specialization
              : user.specialization;
          user.position =
            typeof position == 'string' ? position : user.position;
          user.workExperience =
            typeof workExperience == 'number'
              ? workExperience
              : user.workExperience;
          user.pdAgreement =
            typeof pdAgreement == 'boolean' ? pdAgreement : user.pdAgreement;
          user.newsletterAgreement =
            typeof newsletterAgreement == 'boolean'
              ? newsletterAgreement
              : user.newsletterAgreement;

          await user.save();

          res.status(204).json(user.toJSON());
          return user;
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

        const user = await User.findByPk(parseInt(id));

        if (user === null) {
          returnError(null, res, ['Not found']);
        } else {
          await user.destroy();
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
}

export const userController = new UserController();
