/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import { Role } from './models/Role.js';
import { User } from './models/User.js';
import { passwordHash } from '../utils/hash.js';
import { ROLE_ADMIN } from '../utils/common.js';

export const adminRoleMigration = async () => {
  const exists = await Role.findOne<any>({
    where: {
      guardName: ROLE_ADMIN,
    },
  });

  if (!exists) {
    await Role.create({
      name: 'Админ',
      guardName: ROLE_ADMIN,
      rolePriority: '1',
      description:
        'Включает в себя все возможные права. Имеет доступ в административную панель.',
    });
  }
};

export const adminEntryMigration = async () => {
  const adminRole = await Role.findOne<any>({
    where: {
      guardName: ROLE_ADMIN,
    },
  });

  const exists = await User.findOne<any>({
    where: {
      name: 'Admin',
    },
  });

  if (adminRole && !exists) {
    const password = passwordHash(
      process.env.ADMIN_PASS ? process.env.ADMIN_PASS : ROLE_ADMIN,
    );

    await User.create({
      name: 'Admin',
      lastname: 'Admin',
      email: process.env.ADMIN_LOGIN,
      password: password,
      roleId: adminRole.id,
    });
  }
};
