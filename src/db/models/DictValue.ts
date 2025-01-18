import { DataTypes } from "sequelize";
import sequelize from "../config";

export const DictValue = sequelize.define(
    'dict_value',
    {
        value: { type: DataTypes.STRING, allowNull: false, defaultValue: '', }, // required
        dict_id: { type: DataTypes.INTEGER, allowNull: false },                 // required
    }
);