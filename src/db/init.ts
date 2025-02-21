import { Survey } from './models/survey/Survey.js';
import { SurveyQuestion } from './models/survey/SurveyQuestion.js';
import { SurveyList } from './models/survey/SurveyList.js';
import { applyTestDB } from './test/mock.js';
import { SurveyData } from './models/survey/SurveyData.js';
import { SurveyAnswer } from './models/survey/SurveyAnswer.js';
import { adminEntryMigration, adminRoleMigration } from './migrations.js';
import { Dict } from './models/dictionary/Dict.js';
import { DictValue } from './models/dictionary/DictValue.js';
import { Region } from './models/regions/Region.js';
import { City } from './models/regions/City.js';
import { RoleModel } from './models/Role.js';
import { UserModel } from './models/User.js';

export const dbSyncAll = async () => {
  const opt = { alter: true };
  await UserModel.sync(opt);
  await RoleModel.sync(opt);
  await Survey.sync(opt);
  await SurveyQuestion.sync(opt);
  await SurveyList.sync(opt);
  await SurveyData.sync(opt);
  await SurveyAnswer.sync(opt);
  await Dict.sync(opt);
  await DictValue.sync(opt);
  await Region.sync(opt);
  await City.sync(opt);

  // TODO: Миграции должны накатываться итеративно
  //#region Миграции
  await adminRoleMigration(); // создаём роль админа
  await adminEntryMigration(); // создаём учётную запись админа
  //#endregion
};

export const dbDropAll = async (users = false) => {
  if (!users) {
    await UserModel.drop();
    await RoleModel.drop();
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
};

export const dbTestAll = async (users = false) => {
  await dbDropAll(users);
  await dbSyncAll();

  await applyTestDB();
};
