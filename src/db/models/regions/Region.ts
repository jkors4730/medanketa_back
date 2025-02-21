import { DataTypes } from 'sequelize';
import sequelize from '../../config.js';

export const Region = sequelize.define('region', {
  title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
});
