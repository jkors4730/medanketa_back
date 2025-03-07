import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import { Survey } from './Survey.js';

export const SurveyQuestion = sequelize.define(
  'survey_questions',
  {
    surveyId: { type: DataTypes.INTEGER, allowNull: false }, // required
    question: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    status: { type: DataTypes.BOOLEAN, allowNull: false }, // required

    description: { type: DataTypes.STRING, defaultValue: '' },
    data: { type: DataTypes.TEXT, defaultValue: '' },
    sortId: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
);
