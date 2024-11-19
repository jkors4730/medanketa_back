import { DataTypes } from "sequelize";
import sequelize from "../config";

export const Role = sequelize.define(
    'role',
    {
        name: { type: DataTypes.STRING, allowNull: false },       // required
        guardName: { type: DataTypes.STRING, allowNull: false }, // required
        
        rolePriority: DataTypes.STRING,
        description: DataTypes.STRING,
    }
);