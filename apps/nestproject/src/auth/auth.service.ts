import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "apps/nestproject/src/users/dto/createUser.dto";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class AuthService {
  constructor(
    @Inject("AUTH_CLIENT") private readonly authAppService: ClientProxy
  ) {}

  async login(userDto: CreateUserDto) {
    const token = this.authAppService.send(
      { role: "auth", cmd: "login" },
      { data: userDto }
    );
    let temp;

    await token.forEach((value) => (temp = value));
    if (temp === false) {
      throw new HttpException(
        "Неправильно указан email или пароль",
        HttpStatus.BAD_REQUEST
      );
    }
    return temp;
  }

  async registration(userDto: CreateUserDto) {
    const candidate = this.authAppService.send(
      { role: "auth", cmd: "registration" },
      { data: userDto }
    );
    let temp;

    await candidate.forEach((value) => (temp = value));
    if (temp === false) {
      throw new HttpException(
        "Пользователь с таким email существует",
        HttpStatus.BAD_REQUEST
      );
    }
    return temp;
  }
}
