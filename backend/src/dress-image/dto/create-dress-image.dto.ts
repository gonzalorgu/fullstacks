import { IsString, IsNumber, IsBoolean, IsOptional } from "class-validator";

export class CreateDressImageDto {
  @IsNumber()
  dress_id: number;

  @IsString()
  image_url: string;

  @IsOptional()
  @IsBoolean()
  is_main?: boolean;
}
