/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error.js';
import { Role } from '../db/models/Role.js';
import { Service } from 'typedi';
@Service()
export class RoleController {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { name, guardName } = req.body;

        const role = Role.build({
          name,
          guardName,
        });

        await role.save();

        res.status(201).json(role.toJSON());
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const roles = await Role.findAll();

      res.json(roles);
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
        const { name, guardName } = req.body;

        const role = await Role.findByPk<any>(parseInt(id));

        if (role === null) {
          returnError(null, res, [`Role with id = ${id} not found`]);
        } else {
          role.name = name || role.name;
          role.guardName = guardName || role.guardName;

          await role.save();

          res.status(200).json(role.toJSON());
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
        const { id } = req.params;

        const role = await Role.findByPk(parseInt(id));

        if (role === null) {
          returnError(null, res, [`Role with id = ${id} not found`]);
        } else {
          await role.destroy();
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

export const roleController = new RoleController();
