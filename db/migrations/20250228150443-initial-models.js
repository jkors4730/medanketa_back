'use strict';

import {DataTypes} from "sequelize";
/** @type {import('sequelize-cli').Migration} */

 export async function up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('survey_lists', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
      userId: { type: DataTypes.BIGINT }, // required
      surveyId: { type: DataTypes.INTEGER, allowNull: false }, // required
      uIndex: { type: DataTypes.TEXT, unique: true },

      privacy: { type: DataTypes.BOOLEAN, defaultValue: false },
      answers: { type: DataTypes.JSON, defaultValue: [] },

      tsStart: { type: DataTypes.DATE },
      tsEnd: { type: DataTypes.DATE },
    })
    await queryInterface.createTable('survey_data', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
      sq_id: { type: DataTypes.INTEGER, allowNull: false }, // required
      uid: { type: DataTypes.BIGINT },
      sortId: { type: DataTypes.INTEGER },
      value: { type: DataTypes.TEXT },
    })
    await queryInterface.createTable('survey_answers', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
      sl_id: { type: DataTypes.INTEGER, allowNull: false }, // required
      sq_id: { type: DataTypes.INTEGER, allowNull: false }, // required
      surveyId: { type: DataTypes.INTEGER, allowNull: false }, // required
      userId: { type: DataTypes.BIGINT, allowNull: false }, // required
      answer: { type: DataTypes.TEXT },
      isSkip: { type: DataTypes.BOOLEAN, defaultValue: false },
    })
    await queryInterface.createTable('specs', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    })
    await queryInterface.createTable('regions', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    })
    await queryInterface.createTable('dict_values', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
      value: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      dictId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // required
      sortId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // required
    })
    await queryInterface.createTable('cities', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    })
    await queryInterface.createTable('authUserDevices', {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        devices: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    })
  }

 export async function down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('survey_lists', {})
    await queryInterface.dropTable('survey_data', {})
    await queryInterface.dropTable('survey_answers', {})
    await queryInterface.dropTable('specs', {})
    await queryInterface.dropTable('regions', {})
    await queryInterface.dropTable('dict_values', {})
    await queryInterface.dropTable('cities', {})
  }
