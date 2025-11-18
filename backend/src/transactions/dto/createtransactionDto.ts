import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsDateString,
  IsEnum,
} from "class-validator";

export class CreateTransactionDto {
  @IsEnum(["alquiler"])
  tipo: "alquiler";

  @IsString()
  dressId: string;

  @IsString()
  dressNombre: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsDateString()
  desde?: string;

  @IsOptional()
  @IsDateString()
  hasta?: string;

  @IsOptional()
  @IsString()
  talla?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  clienteNombre?: string;

  @IsOptional()
  @IsEmail()
  clienteEmail?: string;
}
