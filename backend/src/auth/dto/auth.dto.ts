import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
  Matches,
  IsDateString,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  nombre: string;

  @IsString()
  @Matches(/^9\d{8}$/, {
    message: "El teléfono debe tener 9 dígitos y comenzar con 9",
  })
  telefono: string;

  @IsString()
  @Matches(/^\d{8}$/, {
    message: "El DNI debe tener 8 dígitos",
  })
  dni: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsString()
  @MinLength(5)
  direccion: string;

  @IsOptional()
  @IsIn(["user", "admin"])
  role?: "user" | "admin";
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  @Matches(/^9\d{8}$/, {
    message: "El teléfono debe tener 9 dígitos y comenzar con 9",
  })
  telefono?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  direccion?: string;
}
