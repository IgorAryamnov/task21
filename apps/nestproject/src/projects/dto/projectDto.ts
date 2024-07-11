import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class CreateProjectDto {
  @ApiProperty({
    example: "Super Project",
    description: "Название проекта",
  })
  @Length(10, 30, { message: "Неправильная длина названия проекта" })
  readonly name: string;
  @ApiProperty({
    example: "Super Puper Best Project",
    description: "Описание проекта",
  })
  @Length(0, 100, { message: "Неправильная длина описания проекта" })
  readonly description: string;
}
