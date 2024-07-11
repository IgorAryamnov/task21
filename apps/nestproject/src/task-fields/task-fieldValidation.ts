import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class FieldsValidation {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор проекта",
  })
  @IsInt()
  @Type(() => Number)
  project: number;

  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор поля",
  })
  @IsInt()
  @Type(() => Number)
  field: number;
}
