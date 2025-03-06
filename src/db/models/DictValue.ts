import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

export const DictValue = sequelize.define(
  'dict_values',
  {
    value: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
    dictId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // required
    sortId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // required
  }
);
