'use strict';

import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const [exists] = await queryInterface.sequelize.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'roles' AND column_name = 'permissions'`)
    if (exists.length === 0) {

      // await queryInterface.addColumn('roles','permissions', {
      //   permissions: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false, defaultValue: [] },
      // },{
      //   using: 'permissions::TEXT[]'
      // })
      await queryInterface.sequelize.query(` ALTER TABLE roles ADD COLUMN permissions TEXT[] DEFAULT '[]'`);
    } else {
      console.log(`permission_column updated`)
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // await queryInterface.removeColumn("roles", "permissions")
  }
};
