import type { CreateUserDto } from '../dto/users/create.user.dto.js';
import { User } from '../db/models/User.js';
import type { Model } from 'sequelize';
import { ROLE_INT, ROLE_RESP } from '../utils/common.js';
import { Role } from '../db/models/Role.js';
import { rolePermissionMap } from '../constants/roles.constanst.js';
import { passwordHash } from '../utils/hash.js';
export class UsersService {
  static async create(createUserDto: CreateUserDto): Promise<Model<any, any>> {
    const mapping: Record<string, string> = {
      Интервьюер: ROLE_INT,
      Респондент: ROLE_RESP,
    };
    const guardName = mapping[createUserDto.roleName];
    // find or create role
    const [role] = await Role.findOrCreate<any>({
      where: { guardName: mapping[createUserDto.roleName] },
      defaults: {
        name: createUserDto.roleName,
        guardName: guardName,
        permissions: rolePermissionMap[guardName],
      },
    });
    console.log('Role', role.toJSON(), role.id);
    const WorkExperience = Number(createUserDto.workExperience);
    const hash = passwordHash(createUserDto.password);
    const user = User.build({
      name: createUserDto.name,
      email: createUserDto.email,
      lastName: createUserDto.lastName,
      surname: createUserDto.surname,
      password: hash, // store hashed password in db
      roleId: role.id, // connect with role
      phone: createUserDto.phone,
      birthDate: createUserDto.birthDate,
      region: createUserDto.region,
      city: createUserDto.city,
      workPlace: createUserDto.workPlace,
      specialization: createUserDto.specialization,
      position: createUserDto.position,
      WorkExperience,
      pdAgreement: createUserDto.pdAgreement,
      newsletterAgreement: createUserDto.newsLetterAgreement,
    });

    console.log('User', user.toJSON());

    await user.save();
    return user;
  }
  static async findOneUser(email: string): Promise<Model<typeof User>> {
    return User.findOne({ where: { email: email } });
  }
}
