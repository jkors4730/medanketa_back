'use strict';

import sequelize, { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const [exists] = await queryInterface.sequelize.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'roles' AND column_name = 'permissions';
    `);

    if (exists.length === 0) {
      await queryInterface.addColumn('roles', 'permissions', {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: sequelize.literal(`ARRAY[]::TEXT[]`) // Используем правильное приведение типов
      });
    } else {
      console.log(`permission_column already exists`);
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('roles', 'permissions');
  }
};
