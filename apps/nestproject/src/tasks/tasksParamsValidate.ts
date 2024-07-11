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

export class ParamsUpdateValidation {
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
    description: "Уникальный идентификатор задачи",
  })
  @IsInt()
  @Type(() => Number)
  target: number;
}

export class ParamsOrderValidation {
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
    description: "Уникальный идентификатор задачи",
  })
  @IsInt()
  @Type(() => Number)
  target: number;

  @ApiProperty({
    example: "1",
    description: "Индекс, на который нужно переместить задачу",
  })
  @IsInt()
  @Type(() => Number)
  place: number;
}
