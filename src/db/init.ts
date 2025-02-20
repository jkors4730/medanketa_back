import { Role } from './models/Role.js';
import { User } from './models/User.js';
import { Survey } from './models/Survey.js';
import { SurveyQuestion } from './models/SurveyQuestion.js';
import { SurveyList } from './models/SurveyList.js';
import { applyTestDB } from './mock.js';
import { SurveyData } from './models/SurveyData.js';
import { SurveyAnswer } from './models/SurveyAnswer.js';
import { adminEntryMigration, adminRoleMigration } from './migrations.js';
import { Dict } from './models/Dict.js';
import { DictValue } from './models/DictValue.js';
import { Region } from './models/Region.js';
import { City } from './models/City.js';

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

  // TODO: Миграции должны накатываться итеративно
  //#region Миграции
  await adminRoleMigration(); // создаём роль админа
  await adminEntryMigration(); // создаём учётную запись админа
  //#endregion
};

export const dbDropAll = async (users = false) => {
  if (!users) {
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
};

export const dbTestAll = async (users = false) => {
  await dbDropAll(users);
  await dbSyncAll();

  await applyTestDB();
};
