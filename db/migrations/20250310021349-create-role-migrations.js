'use strict';

import sequelize, { DataTypes } from 'sequelize'
import { ROLE_ADMIN } from '../../dist/utils/common.js'

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      guardName: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      rolePriority: { type: DataTypes.STRING, defaultValue: '' },
      description: { type: DataTypes.STRING, defaultValue: '' },
      permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: sequelize.literal(`ARRAY[]::TEXT[]`)
      },
    })
    const [exists] = await queryInterface.sequelize.query(`
    SELECT id FROM roles WHERE "guardName" = '${ROLE_ADMIN}' LIMIT 1`)
    if (exists.length === 0) {
      await queryInterface.bulkInsert('roles', [
        {
          name: 'Админ',
          guardName: ROLE_ADMIN,
          permissions: ['*'],
        },
      ]);
    } else {
      console.log(`role ${ROLE_ADMIN} has already been updated`);
    }
    const interviewerData = {
      name: 'Интервьюер',
      guardName: 'interviewer',
      rolePriority: '',
      description: '',
      permissions: Sequelize.literal(`ARRAY['user:create', 'user:update', 'users:get','user:delete', 'survey:create', 'survey:update', 'surveys:get','survey:delete', 'dict:create', 'dict:update', 'dicts:get','dict:delete', 'dict-value:create', 'dict-value:update', 'dict-values:get','dict-value:delete']::TEXT[]`),
    };

    const respondentData = {
      name: 'Респондент',
      guardName: 'respondent',
      rolePriority: '',
      description: '',
      permissions: Sequelize.literal(`ARRAY['user:create', 'user:update', 'users:get','user:delete', 'surveys:get']::TEXT[]`),
    };

    await queryInterface.bulkInsert('roles', [interviewerData, respondentData], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('roles', {})
  }
};
