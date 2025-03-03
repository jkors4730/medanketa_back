import { DataTypes, Model } from 'sequelize';
import sequelize from '../config.js';
import { SurveyQuestion } from './SurveyQuestion.js';
import { User } from './User.js';

export const Survey = sequelize.define('survey', {
  // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // required
  image: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  slug: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // required
  access: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // required
  isDraft: { type: DataTypes.BOOLEAN, defaultValue: false },
  description: { type: DataTypes.STRING, defaultValue: '' },
  expireDate: DataTypes.DATE,
});
