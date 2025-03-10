import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  roleName: string;
  @IsNotEmpty()
  @IsBoolean()
  pdAgreement: boolean;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsString()
  surname?: string;
  @IsOptional()
  @IsString()
  birthDate?: string;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  region?: string;
  @IsOptional()
  @IsString()
  city?: string;
  @IsOptional()
  @IsString()
  workPlace?: string;
  @IsOptional()
  @IsString()
  specialization?: string;
  @IsOptional()
  @IsString()
  position?: string;
  @IsOptional()
  workExperience?: string;
  @IsOptional()
  @IsString()
  newsLetterAgreement?: boolean;
}
