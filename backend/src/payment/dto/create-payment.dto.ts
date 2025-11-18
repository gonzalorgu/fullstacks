import { IsNumber, IsString, IsOptional, Min } from "class-validator";

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01, { message: "El monto debe ser mayor a 0" })
  amount: number;

  @IsString()
  payment_date: string;

  @IsString()
  payment_method: string;

  @IsString()
  rental_id: string;

  @IsNumber()
  user_id: number;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  receipt_image?: string;
}
