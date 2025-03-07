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
    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      email: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      password: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      roleId: { type: DataTypes.INTEGER, allowNull: false }, // required

      lastName: { type: DataTypes.STRING, defaultValue: '' },
      surname: { type: DataTypes.STRING, defaultValue: '' },
      emailVerifiedAt: DataTypes.DATE,
      birthDate: { type: DataTypes.STRING, defaultValue: '' },
      phone: { type: DataTypes.STRING, defaultValue: '' },
      region: { type: DataTypes.STRING, defaultValue: '' },
      city: { type: DataTypes.STRING, defaultValue: '' },
      workPlace: { type: DataTypes.STRING, defaultValue: '' },
      specialization: { type: DataTypes.STRING, defaultValue: '' },
      position: { type: DataTypes.STRING, defaultValue: '' },
      workExperience: DataTypes.INTEGER,
      pdAgreement: DataTypes.BOOLEAN,
      newsletterAgreement: DataTypes.BOOLEAN,
      twoFactorSecret: { type: DataTypes.STRING, defaultValue: '' },
      twoFactorRecoveryCodes: { type: DataTypes.STRING, defaultValue: '' },
      twoFactorConfirmedAt: DataTypes.DATE,
      rememberToken: { type: DataTypes.STRING, defaultValue: '' },
      avatar: { type: DataTypes.STRING, defaultValue: '' },
    })
    await queryInterface.createTable('survey_questions', {
      surveyId: { type: DataTypes.INTEGER, allowNull: false }, // required
      question: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      type: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      status: { type: DataTypes.BOOLEAN, allowNull: false }, // required

      description: { type: DataTypes.STRING, defaultValue: '' },
      data: { type: DataTypes.TEXT, defaultValue: '' },
      sortId: { type: DataTypes.INTEGER, defaultValue: 0 },
    })
    await queryInterface.createTable('survey_lists', {
      userId: { type: DataTypes.BIGINT }, // required
      surveyId: { type: DataTypes.INTEGER, allowNull: false }, // required
      uIndex: { type: DataTypes.TEXT, unique: true },

      privacy: { type: DataTypes.BOOLEAN, defaultValue: false },
      answers: { type: DataTypes.JSON, defaultValue: [] },

      tsStart: { type: DataTypes.DATE },
      tsEnd: { type: DataTypes.DATE },
    })
    await queryInterface.createTable('survey_data', {
      sq_id: { type: DataTypes.INTEGER, allowNull: false }, // required
      uid: { type: DataTypes.BIGINT },
      sortId: { type: DataTypes.INTEGER },
      value: { type: DataTypes.TEXT },
    })
    await queryInterface.createTable('survey_answers', {
      sl_id: { type: DataTypes.INTEGER, allowNull: false }, // required
      sq_id: { type: DataTypes.INTEGER, allowNull: false }, // required
      surveyId: { type: DataTypes.INTEGER, allowNull: false }, // required
      userId: { type: DataTypes.BIGINT, allowNull: false }, // required
      answer: { type: DataTypes.TEXT },
      isSkip: { type: DataTypes.BOOLEAN, defaultValue: false },
    })
    await queryInterface.createTable('surveys', {
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
    await queryInterface.createTable('specs', {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    })
    await queryInterface.createTable('roles', {
      name: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      guardName: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required

      rolePriority: { type: DataTypes.STRING, defaultValue: '' },
      description: { type: DataTypes.STRING, defaultValue: '' },
    })
    await queryInterface.createTable('regions', {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    })
    await queryInterface.createTable('dict_values', {
      value: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      dictId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // required
      sortId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // required
    })
    await queryInterface.createTable('dicts', {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      common: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // required
      status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // required
      description: { type: DataTypes.STRING, defaultValue: '' },
      userId: { type: DataTypes.INTEGER },
      values: { type: DataTypes.JSON },
    })
    await queryInterface.createTable('cities', {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    })
  }

 export async function down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users', {})
    await queryInterface.dropTable('survey_questions', {})
    await queryInterface.dropTable('survey_lists', {})
    await queryInterface.dropTable('survey_data', {})
    await queryInterface.dropTable('survey_answers', {})
    await queryInterface.dropTable('surveys', {})
    await queryInterface.dropTable('specs', {})
    await queryInterface.dropTable('roles', {})
    await queryInterface.dropTable('regions', {})
    await queryInterface.dropTable('dict_values', {})
    await queryInterface.dropTable('dicts', {})
    await queryInterface.dropTable('cities', {})
  }
