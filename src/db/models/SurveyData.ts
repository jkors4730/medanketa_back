import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

export const SurveyData = sequelize.define('survey_data', {
  sq_id: { type: DataTypes.INTEGER, allowNull: false }, // required
  uid: { type: DataTypes.BIGINT },
  sortId: { type: DataTypes.INTEGER },
  value: { type: DataTypes.TEXT },
});
