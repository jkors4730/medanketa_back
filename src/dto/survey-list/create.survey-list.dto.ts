import { body } from 'express-validator';
import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateSurveysListDto {
  @IsNumber()
  surveyId: number;
  @IsOptional()
  @IsNumber()
  userId: number;
  @IsOptional()
  @IsBoolean()
  privacy: boolean;
  @IsOptional()
  @IsArray()
  answers: [object];
  @IsOptional()
  @IsISO8601()
  tsStart: Date;
  @IsOptional()
  @IsISO8601()
  tsEnd: Date;
}
