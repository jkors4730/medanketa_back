//#region Interfaces
export interface StatsQuestion {
  id?: number;
  question?: string;
  type?: string;
  surveyId?: number;
  data?: string;
}

export interface StatsAnswer {
  id?: number;
  sq_id?: number;
  user_id?: string;
  answer?: string;
  count?: number;
}

export interface StatsDMapped {
  id?: number;
  value?: string;
  sortId?: number;
}

export interface StatsAMapped {
  id?: number;
  answer?: string;
  count?: number;
}
export interface StatsQAMapped {
  id?: number;
  question?: string;
  type?: string;
  data: StatsDMapped[];
  answers: Map<string, StatsAMapped>;
}
export interface StatsQBMapped {
  answers: StatsAMapped[];
  id?: number;
  question?: string;
  type?: string;
  data: StatsDMapped[];
}

export interface Time {
  seconds?: number;
  minutes?: number;
  hours?: number;
}
//#endregion
