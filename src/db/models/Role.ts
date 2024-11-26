import { DataTypes } from "sequelize";
import sequelize from "../config";

export const Role = sequelize.define(
    'role',
    {
        name: { type: DataTypes.STRING, allowNull: false, defaultValue: '', },       // required
        guardName: { type: DataTypes.STRING, allowNull: false, defaultValue: '', }, // required
        
        rolePriority: { type: DataTypes.STRING, defaultValue: '', },
        description: { type: DataTypes.STRING, defaultValue: '', },
    }
);