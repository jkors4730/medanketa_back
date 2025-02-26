import { Role } from '../db/models/Role.js';
import { Inject, Service } from 'typedi';

import { UpdateRoleDto } from '../dto/roles/update.role.dto.js';
import { CreateRoleDto } from '../dto/roles/create.role.dto.js';
import { UsersService } from './users.service.js';
import { Model } from 'sequelize';
@Service()
export class RolesService {
  static async createRole(
    createRoleDto: CreateRoleDto,
  ): Promise<Model<any, any>> {
    const newRole = await Role.create({ ...createRoleDto });
    return newRole;
  }
  static async getRoleById(id: number): Promise<Model<any, any>> {
    const role = await Role.findByPk(id);
    return role;
  }
  static async updateRole(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<void> {
    const upd = await Role.findOne({ where: { id: id } });
    if (!upd) {
      return null;
    }
    await Role.update({ ...updateRoleDto }, { where: { id: id } });
  }
  static async deleteRole(id: number): Promise<void> {
    await Role.destroy({ where: { id: id } });
  }
  static async getRoleByGuardName<T>(value: T) {
    return await Role.findOne({ where: { value } });
  }
  static async setRoleByUser(userId: number, roleId: number) {
    const role = await this.getRoleById(roleId);
    const user = await UsersService.getOneUser(userId);
    if (!user || !role) {
      return Error(`user or role does not found`);
    }
    //TODO
    // await user.$set('roleId', role.id);
    // await user.save();
    return;
  }

  static async getAllRoles() {
    return Role.findAll();
  }
}
