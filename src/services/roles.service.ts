import { RoleModel } from '../db/models/Role.js';
import { Inject, Service } from 'typedi';
import { Repository } from 'sequelize-typescript';
import { UpdateRoleDto } from '../dto/roles/update.role.dto.js';
import { CreateRoleDto } from '../dto/roles/create.role.dto.js';
import { UsersService } from './users.service.js';
@Service()
export class RolesService {
  constructor(
    @Inject('RoleModel') private readonly roleRepo: Repository<RoleModel>,
    private readonly userService: UsersService,
  ) {}
  async createRole(createRoleDto: CreateRoleDto): Promise<RoleModel> {
    const newRole = await this.roleRepo.create({ ...createRoleDto });
    return newRole;
  }
  async getRoleById(id: number): Promise<RoleModel> {
    const role = await this.roleRepo.findByPk(id);
    return role;
  }
  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<void> {
    const upd = await this.roleRepo.findOne({ where: { id: id } });
    if (!upd) {
      return null;
    }
    await this.roleRepo.update({ ...updateRoleDto }, { where: { id: id } });
  }
  async deleteRole(id: number): Promise<void> {
    await this.roleRepo.destroy({ where: { id: id } });
  }
  async getRoleByGuardName<T>(value: T) {
    return await this.roleRepo.findOne({ where: { value } });
  }
  async setRoleByUser(userId: number, roleId: number) {
    const role = await this.getRoleById(roleId);
    const user = await this.userService.getOneUser(userId);
    if (!user || !role) {
      return Error(`user or role does not found`);
    }
    await user.$set('roleId', role.id);
    await user.save();
    return;
  }

  async getAllRoles() {
    return this.roleRepo.findAll();
  }
}
