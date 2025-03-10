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
    await queryInterface.createTable('surveys', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false }, // required
      image: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      slug: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // required
      access: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // required
      isDraft: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      description: { type: DataTypes.STRING, defaultValue: '' },
      expireDate: DataTypes.DATE,
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('surveys', {})
  }
};
