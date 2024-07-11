import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    example: "IgorSsS@mail.ru",
    description: "Почта",
  })
  @IsEmail({}, { message: "Неправильно указан email" })
  readonly email: string;
  @ApiProperty({
    example: "qwer",
    description: "Пароль",
  })
  @Length(4, 16, { message: "Неправильная длина пароля" })
  readonly password: string;
}
