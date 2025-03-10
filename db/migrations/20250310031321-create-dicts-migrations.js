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
    await queryInterface.createTable('dicts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      common: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // required
      status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // required
      description: { type: DataTypes.STRING, defaultValue: '' },
      userId: { type: DataTypes.INTEGER },
      values: { type: DataTypes.JSON },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    })
    await queryInterface.addColumn('dicts', 'typeDictionary', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'global',
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('dicts', {})
  }
};
