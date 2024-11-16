import { DataTypes } from "sequelize";
import sequelize from "../config";

export const Survey = sequelize.define(
    'survey',
    {
        user_id: { type: DataTypes.INTEGER, allowNull: false },  // required
        image: { type: DataTypes.STRING, allowNull: false }, // required
        title: { type: DataTypes.STRING, allowNull: false }, // required
        slug: { type: DataTypes.STRING, allowNull: false }, // required
        status: { type: DataTypes.BOOLEAN, allowNull: false }, // required

        description: DataTypes.STRING,
        expire_date: DataTypes.DATE,
    }
);