import { DataTypes } from "sequelize";
import sequelize from "../config";

export const Dict = sequelize.define(
    'dict',
    {
        title: { type: DataTypes.STRING, allowNull: false, defaultValue: '', },       // required
        common: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, },  // required
        status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, },   // required
        description: { type: DataTypes.STRING, defaultValue: '', },
        userId: { type: DataTypes.INTEGER },
    }
);