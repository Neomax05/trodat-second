import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/modules/users/enums';

export class SignUpDto {
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

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  created_at: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  updated_at: string;
}
