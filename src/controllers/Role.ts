/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error.js';
import { Role } from '../db/models/Role.js';
import { Service } from 'typedi';
import { User } from '../db/models/User.js';
@Service()
export class RoleController {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { name, guardName, permissions } = req.body;

        const role = await Role.create({
          name,
          guardName,
          permissions,
        });

        res.status(201).json({ status: true, text: 'role created' });
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      res.json(
        await Role.findAll({
          attributes: ['id', 'name', 'guardName'],
        }),
      );
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;
        const role = await Role.findByPk(parseInt(id));

        if (role === null) {
          returnError(null, res, [`Role with id = ${id} not found`]);
        } else {
          res.status(200).json(role.toJSON());
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
        const { name, guardName, permissions } = req.body;
        const role = await Role.findByPk(parseInt(id));

        if (role === null) {
          returnError(null, res, [`Role with id = ${id} not found`]);
        } else {
          await role.update({ name, guardName, permissions });

          res.status(200).json({ status: true, text: 'role updated' });
        }

        res.status(200).end();
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
        const { id } = req.body;

        const role = await Role.findByPk(parseInt(id));

        if (role === null) {
          returnError(null, res, [`Role with id = ${id} not found`]);
        } else {
          await role.destroy();
          res.status(200).json({ status: true, text: 'role deleted' });
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
  async changeRoleOnUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const { userId, roleId } = req.body;
        const user = await User.findOne({ where: { id: parseInt(userId) } });
        const role = await Role.findOne({ where: { id: parseInt(roleId) } });
        if (!user || !role) {
          res.status(404).json(`user or role not found`);
          return;
        }
        await user.update({ roleId: role.dataValues.id });
        res.status(200).json({
          status: true,
          text: 'role changed!',
          userId: user.dataValues.id,
          roleId: role.dataValues.id,
        });
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
}

export const roleController = new RoleController();
