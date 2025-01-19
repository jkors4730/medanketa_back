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
import { Region } from "./models/Region";
import { City } from "./models/City";
import { Spec } from "./models/Spec";

export const dbSyncAll = async () => {
    const opt = { alter: true };
    await User.sync(opt);
    await Role.sync(opt);
    await Survey.sync(opt);
    await SurveyQuestion.sync(opt);
    await SurveyList.sync(opt);
    await SurveyData.sync(opt);
    await SurveyAnswer.sync(opt);
    await Dict.sync(opt);
    await DictValue.sync(opt);
    await Region.sync(opt);
    await City.sync(opt);
    await Spec.sync(opt);
    //#region Миграции
    await adminRoleMigration(); // создаём роль админа
    await adminEntryMigration(); // создаём учётную запись админа
    //#endregion
};

export const dbDropAll = async (users = false) => {
    if ( !users ) {
        await User.drop();
        await Role.drop();
    }
    await Survey.drop();
    await SurveyQuestion.drop();
    await SurveyList.drop();
    await SurveyData.drop();
    await SurveyAnswer.drop();
    await Dict.drop();
    await DictValue.drop();
    await Region.drop();
    await City.drop();
    await Spec.drop();
};

export const dbTestAll = async (users = false) => {
    await dbDropAll(users);
    await dbSyncAll();

    await applyTestDB();
};