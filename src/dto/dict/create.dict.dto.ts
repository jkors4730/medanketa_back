import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDictDto {
  @IsNotEmpty()
  title: string;
  @IsBoolean()
  common: boolean;
  @IsBoolean()
  status: boolean;
  @IsNumber()
  userId: number;
  @IsOptional()
  @IsString()
  description?: string;
  values?: [];
}
export class GetOneDictDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
