import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

export const SurveyList = sequelize.define(
  'survey_list',
  {
    userId: { type: DataTypes.BIGINT }, // required
    surveyId: { type: DataTypes.INTEGER, allowNull: false }, // required
    uIndex: { type: DataTypes.TEXT, unique: true },

    privacy: { type: DataTypes.BOOLEAN, defaultValue: false },
    answers: { type: DataTypes.JSON, defaultValue: [] },

    tsStart: { type: DataTypes.DATE },
    tsEnd: { type: DataTypes.DATE },
  },
  {
    tableName: 'survey_lists',
  },
);
