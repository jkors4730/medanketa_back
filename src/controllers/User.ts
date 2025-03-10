/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { User } from '../db/models/User.js';
import { returnError } from '../utils/error.js';
import { validationResult } from 'express-validator';
import { Service } from 'typedi';
import { MailService } from '../services/Mail.js';
import { DeleteMessage } from '../services/interfaces/mail.interface.js';
import { UsersService } from '../services/users.service.js';
import { validateBirthDate } from '../utils/validateBirthDate.js';
import { Role } from '../db/models/Role.js';
@Service()
export class UserController {
  nodeMailer = new MailService();
  async create(req: Request, res: Response) {
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
    res.status(200).json(user.toJSON());
  }
  // TODO сделано костыльно с N+1 скоростью, по возможности сделать relations юзеров и ролей
  async getAll(_req: Request, res: Response) {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'lastName',
          'surname',
          'email',
          'phone',
          'isBlocked',
          'updatedAt',
          'roleId',
        ],
      });
      const usersJson = users.map((user) => {
        return user.toJSON();
      });
      const userWithRole = await Promise.all(
        usersJson.map(async (user) => {
          const role = await Role.findOne({
            where: { id: user.roleId },
          });
          if (!role) {
            return user;
          } else {
            user.roleName = role.dataValues.guardName;
            user.status = user.isBlocked;
            user.dateEdit = user.updatedAt;
            delete user.updatedAt;
            delete user.isBlocked;
            return user;
          }
        }),
      );
      res.status(200).json(userWithRole);
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
        const { type } = req.query;

        const user = await User.findByPk(parseInt(id));

        if (user === null) {
          returnError(null, res, ['Not found']);
        } else {
          await user.destroy();
          const message: DeleteMessage = {
            email: user.dataValues.email,
            name: user.dataValues.name,
            lastName: user.dataValues.lastName,
            dateReg: user.dataValues.createdAt,
            platform: 'medanketa.com',
          };
          switch (type) {
            case 'delete':
              await this.nodeMailer.sendAdminDeleteMail(message);
              await this.nodeMailer.sendUserDeleteMail(
                user.dataValues.email,
                message,
              );
              break;
            case 'processingDB':
              await this.nodeMailer.sendAdminProcessingPdMail(message);
              await this.nodeMailer.sendUserProcessingPdMail(
                user.dataValues.email,
                message,
              );
              break;
          }
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

export const userController = new UserController();
