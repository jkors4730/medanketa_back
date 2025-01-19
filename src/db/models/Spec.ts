import { DataTypes } from "sequelize";
import sequelize from "../config";

export const Spec = sequelize.define(
    'spec',
    {
        title: { type: DataTypes.STRING, allowNull: false, defaultValue: '', },       // required
    }
);