import type { CreateUserDto } from '../dto/users/create.user.dto.js';
import type { UpdateUserDto } from '../dto/users/update.user.dto.js';
import { ROLE_INT, ROLE_RESP } from '../utils/common.js';

import { User } from '../db/models/User.js';
import { FindOptions } from 'sequelize';
import { RolesService } from './roles.service.js';
import { Service } from 'typedi';
import { validateBirthDate } from '../utils/validate.birthDate.js';
@Service()
export class UsersService {
  static async createUser(createUserDto: CreateUserDto) {
    const candidate = await User.findOne({
      where: { email: createUserDto.email },
    });
    if (!candidate) {
      const mapping: Record<string, string> = {
        Интервьюер: ROLE_INT,
        Респондент: ROLE_RESP,
      };
      const user = await User.create({ ...createUserDto });
      return user;
    }
  }
  static async getAllUsers() {
    return User.findAll({ include: { all: true } });
  }
  static async getOneUser(
    userId: number,
    opt?: Omit<FindOptions<any>, 'where'>,
  ) {
    return User.findByPk(userId, opt);
  }
  static async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    return User.update({ ...updateUserDto }, { where: { userId } });
  }
  static async deleteUser(userId: number) {
    return User.destroy({ where: { userId } });
  }
}
