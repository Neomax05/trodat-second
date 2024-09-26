import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangeAuthValuesDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @MinLength(3)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  phone_number: string;

  @IsString()
  avatar?: string;
}
