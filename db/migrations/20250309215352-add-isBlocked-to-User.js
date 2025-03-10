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
    const [exists]  = await queryInterface.sequelize.query(`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'isBlocked'`)
    if (exists.length === 0) {
      await queryInterface.addColumn('users', 'isBlocked', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    } else {
      console.log('users.isBlocked up to date')
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'isBlocked');
  }
};
