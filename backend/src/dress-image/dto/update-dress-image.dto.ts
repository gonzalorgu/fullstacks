import { PartialType } from "@nestjs/mapped-types";
import { CreateDressImageDto } from "./create-dress-image.dto";

export class UpdateDressImageDto extends PartialType(CreateDressImageDto) {}
