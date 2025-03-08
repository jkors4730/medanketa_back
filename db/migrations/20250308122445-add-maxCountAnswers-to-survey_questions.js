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
    SELECT column_name FROM information_schema.columns WHERE table_name = 'survey_questions' AND column_name = 'maxCountAnswers'`)
    if (exists.length === 0) {
      await queryInterface.addColumn('survey_questions', 'maxCountAnswers', { type: DataTypes.INTEGER, defaultValue: 1 });
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('survey_questions', 'maxCountAnswers');
  }
};
