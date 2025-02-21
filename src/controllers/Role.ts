import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error.js';
import { Service } from 'typedi';
import { RolesService } from '../services/roles.service.js';
@Service()
export class RoleController {
  constructor(private readonly roleService: RolesService) {}
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const candidate = await this.roleService.getRoleByGuardName(
          req.body.quardName,
        );
        if (candidate) {
          res.status(409).json(`role already exists`);
        }
        const role = await this.roleService.createRole(req.body);
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
      const roles = await this.roleService.getAllRoles();

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

        const role = await this.roleService.getRoleById(parseInt(id));

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
        const role = await this.roleService.getRoleById(parseInt(req.body.id));

        if (role === null) {
          returnError(null, res, [
            `RoleModel with id = ${req.body.id} not found`,
          ]);
        } else {
          await this.roleService.updateRole(req.body.id, req.body);

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

        const role = await this.roleService.getRoleById(parseInt(id));

        if (role === null) {
          returnError(null, res, [`RoleModel with id = ${id} not found`]);
        } else {
          await this.roleService.deleteRole(parseInt(id));
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
