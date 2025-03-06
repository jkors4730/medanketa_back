import {passwordHash} from '../../dist/utils/hash.js';
import{ROLE_ADMIN} from '../../dist/utils/common.js';

export default {
  async up(queryInterface) {

    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM "roles" WHERE "guardName" = '${ROLE_ADMIN}' LIMIT 1;`
    );

    if (!adminRole.length) return; // Если роли нет, не создаем пользователя

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        lastName: 'Admin',
        email: process.env.ADMIN_LOGIN,
        password: passwordHash(process.env.ADMIN_PASS || ROLE_ADMIN),
        roleId: adminRole[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { name: 'admin' }, {});
  },
};
