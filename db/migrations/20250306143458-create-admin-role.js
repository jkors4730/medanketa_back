import { ROLE_ADMIN} from '../../dist/utils/common.js';

export default {
  async up(queryInterface) {
    const exists = await queryInterface.sequelize.query(`
    SELECT id FROM roles WHERE "guardName" = '${ROLE_ADMIN}' LIMIT 1`)
   if (!exists) {
     await queryInterface.bulkInsert('roles', [
       {
         name: 'Админ',
         guardName: ROLE_ADMIN,
         createdAt: new Date(),
         updatedAt: new Date(),
       },
     ]);
   } else {
     console.log(`role ${ROLE_ADMIN} has already been updated`);
   }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', { guardName: ROLE_ADMIN }, {});
  },
};
