import { SurveyAnswer } from '../db/models/survey/SurveyAnswer.js';
import { SurveyData } from '../db/models/survey/SurveyData.js';

export const ROLE_RESP = 'respondent';
export const ROLE_INT = 'interviewer';
export const ROLE_ADMIN = 'admin';
export const ROLE_QUEST = 'quest';

interface Answer {
  id?: number;
  answer?: string;
  isSkip?: boolean;
}

interface Paginator {
  items: any[];
  page: number;
  total: number;
}

export const saveSurveyData = async (data: string, qid: number) => {
  try {
    if (data && typeof data === 'string') {
      const parsed = JSON.parse(data);

      if (parsed.answers && Array.isArray(parsed.answers)) {
        for (const item of parsed.answers) {
          await SurveyData.create({
            sq_id: qid,
            uid: item.id,
            sortId: item.sortId,
            value: item.value,
          });
        }
      }
    } else {
      // type: infoblock
      await SurveyData.create({
        sq_id: qid,
      });
    }
  } catch (e: any) {
    console.error(e);
  }
};

export const saveSurveyAnswers = async (
  surveyId: number,
  userId: number,
  sl_id: number,
  answers: Answer[],
) => {
  try {
    if (Array.isArray(answers)) {
      for (const item of answers) {
        console.log('[answer_item]', item);

        let answer = String(item.answer);

        if (typeof item.answer === 'object') {
          answer = '';
        }

        await SurveyAnswer.create({
          surveyId,
          userId,
          sl_id,
          sq_id: item.id,
          answer: answer,
          isSkip: item.isSkip,
        });
      }
    }
  } catch (e: any) {
    console.error(e);
  }
};

export const returnFromArr = (arr: any, key: string) => {
  try {
    return Array.isArray(arr) && arr.length
      ? arr[0]?.[key]
        ? arr[0]?.[key]
        : null
      : null;
  } catch (e: any) {
    console.error(e);
  }
};

export const returnNumFromArr = (arr: any, key: string) => {
  try {
    return Number(returnFromArr(arr, key));
  } catch (e: any) {
    console.error(e);
  }
};

export const pagination = (
  items: any[],
  page: number,
  total: number,
): Paginator => {
  return {
    items,
    page: Number(page),
    total: Number(total),
  };
};

export const generatePassword = (length: number = 8) => {
  let val = '';

  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0, n = charset.length; i < length; ++i) {
    val += charset.charAt(Math.floor(Math.random() * n));
  }

  return val;
};
