import { ROLE_ADMIN} from '../../dist/utils/common.js';

export default {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Админ',
        guardName: ROLE_ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', { guardName: ROLE_ADMIN }, {});
  },
};
