import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

export const Dict = sequelize.define(
  'dicts',
  {
    title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    common: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // required
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // required
    description: { type: DataTypes.STRING, defaultValue: '' },
    userId: { type: DataTypes.INTEGER },
    values: { type: DataTypes.JSON },
  }
);
