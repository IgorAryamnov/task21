import { Controller, Get } from "@nestjs/common";
import { AuthAppService } from "./auth-app.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AuthAppController {
  constructor(private readonly AuthAppService: AuthAppService) {}

  @MessagePattern({ role: "auth", cmd: "login" })
  log(data) {
    return this.AuthAppService.login(data.data);
  }
  @MessagePattern({ role: "auth", cmd: "registration" })
  reg(data) {
    return this.AuthAppService.registration(data.data);
  }
}
