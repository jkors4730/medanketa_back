import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error.js';
import { Service } from 'typedi';
import { RolesService } from '../services/roles.service.js';
@Service()
export class RoleController {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const candidate = await RolesService.getRoleByGuardName(
          req.body.quardName,
        );
        if (candidate) {
          res.status(409).json(`role already exists`);
        }
        const role = await RolesService.createRole(req.body);
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
      const roles = await RolesService.getAllRoles();

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

        const role = await RolesService.getRoleById(parseInt(id));

        if (role === null) {
          returnError(null, res, [`RoleModel with id = ${id} not found`]);
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
        const role = await RolesService.getRoleById(parseInt(req.body.id));

        if (role === null) {
          returnError(null, res, [
            `RoleModel with id = ${req.body.id} not found`,
          ]);
        } else {
          await RolesService.updateRole(req.body.id, req.body);

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

        const role = await RolesService.getRoleById(parseInt(id));

        if (role === null) {
          returnError(null, res, [`RoleModel with id = ${id} not found`]);
        } else {
          await RolesService.deleteRole(parseInt(id));
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
