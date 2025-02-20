import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUploadFile64Dto {
  @IsNotEmpty()
  @IsString()
  file: string;
  @IsNotEmpty()
  @IsString()
  name: string;
}
