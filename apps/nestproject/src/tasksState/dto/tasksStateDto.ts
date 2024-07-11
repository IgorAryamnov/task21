import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class CreateTasksStateDto {
  @ApiProperty({
    example: "To do",
    description: "Название состояния задачи",
  })
  @Length(4, 15, { message: "Неправильная длина названия состояния задачи" })
  readonly name: string;
}
