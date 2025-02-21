import type { CreateUserDto } from '../dto/users/create.user.dto.js';
import type { UpdateUserDto } from '../dto/users/update.user.dto.js';
import { ROLE_INT, ROLE_RESP } from '../utils/common.js';
import type { RolesService } from './roles.service.js';
import { Inject, Service } from 'typedi';
import { Repository } from 'sequelize-typescript';
import { UserModel } from '../db/models/User.js';
import { FindOptions } from 'sequelize';
@Service()
export class UsersService {
  constructor(
    @Inject('UserModel') private readonly userRepo: Repository<UserModel>,
    private readonly roleService: RolesService,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const candidate = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (!candidate) {
      const mapping: Record<string, string> = {
        Интервьюер: ROLE_INT,
        Респондент: ROLE_RESP,
      };
      const role = await this.roleService.getRoleById(createUserDto.roleId);
      const user = await this.userRepo.create({ ...createUserDto });
      await user.$set('roleId', role.id);
      await user.save();
      return user;
    }
  }
  async getAllUsers() {
    return this.userRepo.findAll({ include: { all: true } });
  }
  async getOneUser(userId: number, opt?: Omit<FindOptions<any>, 'where'>) {
    return this.userRepo.findByPk(userId, opt);
  }
  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({ ...updateUserDto }, { where: { userId } });
  }
  async deleteUser(userId: number) {
    return this.userRepo.destroy({ where: { userId } });
  }
}
