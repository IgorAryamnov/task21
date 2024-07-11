import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateRoleDto } from "./dto/createUser.dto";
import { Role } from "./roles.entity";
import { Roles } from "apps/nestproject/src/auth/roles-auth.decorator";
import { RolesGuard } from "apps/nestproject/src/auth/roles.guard";

@ApiTags("Роли")
@Controller("roles")
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: "Создание категории" })
  @ApiResponse({ status: 200, type: Role })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() roleDto: CreateRoleDto) {
    return this.rolesService.createRole(roleDto);
  }

  @ApiOperation({ summary: "Получение роли" })
  @ApiResponse({ status: 200, type: Role })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get("/:value")
  getRole(@Param("value") value: string) {
    return this.rolesService.findRole(value);
  }

  @ApiOperation({ summary: "Получение всех ролей" })
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  getRoles() {
    return this.rolesService.findAll();
  }
}
