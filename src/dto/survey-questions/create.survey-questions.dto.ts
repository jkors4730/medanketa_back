export class CreateSurveysQuestionsDto {
  questions: [
    {
      surveyId: number;
      question: string;
      type: string;
      status: boolean;
      description: string;
      data: string;
    },
  ];
}
