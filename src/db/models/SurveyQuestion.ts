import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

export const SurveyQuestion = sequelize.define(
  'survey_question',
  {
    surveyId: { type: DataTypes.INTEGER, allowNull: false }, // required
    question: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    status: { type: DataTypes.BOOLEAN, allowNull: false }, // required

    description: { type: DataTypes.STRING, defaultValue: '' },
    data: { type: DataTypes.TEXT, defaultValue: '' },
    sortId: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'survey_questions',
  },
);
