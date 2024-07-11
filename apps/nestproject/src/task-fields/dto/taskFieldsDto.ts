import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class CreateFieldDto {
  @ApiProperty({
    example: "Field",
    description: "Название поля",
  })
  @Length(1, 30, { message: "Неправильная длина названия поля" })
  readonly name: string;

  @ApiProperty({
    example: "string",
    description: "Тип поля",
  })
  @Length(1, 200, { message: "Неправильная длина типа поля" })
  readonly fieldType: string;

  @ApiProperty({
    example: "[1,2,3,4]",
    description: "Значения селективного поля",
  })
  readonly selectiveValues: string[];
}
