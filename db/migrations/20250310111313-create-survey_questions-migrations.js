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
    await queryInterface.createTable('survey_questions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      surveyId: { type: DataTypes.INTEGER, allowNull: false }, // required
      question: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      type: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      status: { type: DataTypes.BOOLEAN, allowNull: false }, // required

      description: { type: DataTypes.STRING, defaultValue: '' },
      data: { type: DataTypes.TEXT, defaultValue: '' },
      sortId: { type: DataTypes.INTEGER, defaultValue: 0 },
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
    await queryInterface.addColumn('survey_questions', 'maxCountAnswers',{ type: DataTypes.INTEGER, defaultValue: 1 })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('survey_questions', {})
  }
};
