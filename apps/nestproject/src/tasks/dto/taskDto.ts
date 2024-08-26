import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({
    example: "Task",
    description: "Название задачи",
  })
  @Length(4, 30, { message: "Неправильная длина названия задачи" })
  readonly name: string;

  @ApiProperty({
    example: "Super Puper Task",
    description: "Описание задачи",
  })
  @Length(0, 200, { message: "Неправильная длина описания задачи" })
  readonly description: string;

  @ApiProperty({
    example: { "1": "FieldValue" },
    description: "Кастомное поле",
  })
  readonly customFields: string[];
}
