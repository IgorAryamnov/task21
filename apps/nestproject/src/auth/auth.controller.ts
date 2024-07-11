import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "apps/nestproject/src/users/dto/createUser.dto";
import { AuthService } from "./auth.service";
import { ClientProxy } from "@nestjs/microservices";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject("AUTH_CLIENT") private readonly authAppService: ClientProxy,
    private authService: AuthService
  ) {}

  @Post("/login")
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post("/registration")
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
}
