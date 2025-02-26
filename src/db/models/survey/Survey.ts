import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config.js';
import { SurveyQuestion } from './SurveyQuestion.js';

export const Survey = sequelize.define('survey', {
  userId: { type: DataTypes.INTEGER, allowNull: false }, // required
  image: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  slug: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // required
  access: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // required
  isDraft: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  description: { type: DataTypes.STRING, defaultValue: '' },
  expireDate: DataTypes.DATE,

  questions: DataTypes.JSON,
});
//relations
Survey.hasMany(SurveyQuestion);
SurveyQuestion.belongsTo(Survey);
