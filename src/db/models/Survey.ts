import { DataTypes } from "sequelize";
import sequelize from "../config";

export const Survey = sequelize.define(
    'survey',
    {
        userId: { type: DataTypes.INTEGER, allowNull: false },  // required
        image: { type: DataTypes.STRING, allowNull: false }, // required
        title: { type: DataTypes.STRING, allowNull: false }, // required
        slug: { type: DataTypes.STRING, allowNull: false }, // required
        status: { type: DataTypes.BOOLEAN, allowNull: false }, // required

        description: DataTypes.STRING,
        expireDate: DataTypes.DATE,
        
        questions: DataTypes.JSON,
    }
);