import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSurveyDto {
  @IsNumber()
  userId: number;
  @IsNotEmpty()
  @IsString()
  image: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  slug: string;
  @IsBoolean()
  status: boolean;
  @IsOptional()
  @IsBoolean()
  access: boolean;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsDate()
  expireDat: Date;
  @IsOptional()
  @IsArray()
  questions: [object];
  @IsOptional()
  @IsNotEmpty()
  file: string;
}
