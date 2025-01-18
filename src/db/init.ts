import { Role } from "./models/Role";
import { User } from "./models/User";
import { Survey } from "./models/Survey";
import { SurveyQuestion } from "./models/SurveyQuestion";
import { SurveyList } from "./models/SurveyList";
import { applyTestDB } from "./mock";
import { SurveyData } from "./models/SurveyData";
import { SurveyAnswer } from "./models/SurveyAnswer";
import { adminEntryMigration, adminRoleMigration } from "./migrations";
import { Dict } from "./models/Dict";
import { DictValue } from "./models/DictValue";

export const dbSyncAll = async () => {
    const common = { alter: true };
    await User.sync(common);
    await Role.sync(common);
    await Survey.sync(common);
    await SurveyQuestion.sync(common);
    await SurveyList.sync(common);
    await SurveyData.sync(common);
    await SurveyAnswer.sync(common);
    await Dict.sync(common);
    await DictValue.sync(common);
    //#region Миграции
    await adminRoleMigration(); // создаём роль админа
    await adminEntryMigration(); // создаём учётную запись админа
    //#endregion
};

export const dbDropAll = async () => {
    await User.drop();
    await Role.drop();
    await Survey.drop();
    await SurveyQuestion.drop();
    await SurveyList.drop();
    await SurveyData.drop();
    await SurveyAnswer.drop();
};

export const dbTestAll = async () => {
    await dbDropAll();
    await dbSyncAll();

    await applyTestDB();
};