import { DataTypes } from "sequelize";
import sequelize from "../config";

export const SurveyAnswer = sequelize.define(
    'survey_answer',
    {
        sl_id: { type: DataTypes.INTEGER, allowNull: false },  // required
        sq_id: { type: DataTypes.INTEGER, allowNull: false },  // required
        answer: { type: DataTypes.TEXT },
    }
);