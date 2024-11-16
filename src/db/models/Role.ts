import { DataTypes } from "sequelize";
import sequelize from "../config";

export const Role = sequelize.define(
    'role',
    {
        name: { type: DataTypes.STRING, allowNull: false },       // required
        guard_name: { type: DataTypes.STRING, allowNull: false }, // required
        
        role_priority: DataTypes.STRING,
        description: DataTypes.STRING,
    }
);