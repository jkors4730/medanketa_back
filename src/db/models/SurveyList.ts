import { DataTypes } from "sequelize";
import sequelize from "../config";

export const SurveyList = sequelize.define(
    'survey_list',
    {
        userId: { type: DataTypes.INTEGER, allowNull: false, },  // required
        surveyId: { type: DataTypes.INTEGER, allowNull: false, }, // required
    }
);