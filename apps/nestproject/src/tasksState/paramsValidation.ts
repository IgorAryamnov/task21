import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class ParamsValidation {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор проекта",
  })
  @IsInt()
  @Type(() => Number)
  project: number;

  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор состояния",
  })
  @IsInt()
  @Type(() => Number)
  state: number;
}

export class ParamsForReplaceOrder {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор проекта",
  })
  @IsInt()
  @Type(() => Number)
  project: number;

  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор состояния",
  })
  @IsInt()
  @Type(() => Number)
  state: number;

  @ApiProperty({
    example: "1",
    description: "На какую позицию нужно переместить столбец состояний",
  })
  @IsInt()
  @Type(() => Number)
  place: number;
}

export class ParamsForReplaceTask {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор проекта",
  })
  @IsInt()
  @Type(() => Number)
  project: number;

  @ApiProperty({
    example: "1",
    description: "Задача, которую хотим переместить",
  })
  @IsInt()
  @Type(() => Number)
  target: number;

  @ApiProperty({
    example: "1",
    description: "Текущее состояние задачи",
  })
  @IsInt()
  @Type(() => Number)
  state: number;

  @ApiProperty({
    example: "1",
    description: "Новое состояние задачи",
  })
  @IsInt()
  @Type(() => Number)
  place: number;
}
