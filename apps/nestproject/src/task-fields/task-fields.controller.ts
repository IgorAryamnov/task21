import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { TaskFieldsService } from "./task-fields.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/nestproject/src/auth/jswAuth.guard";
import { TaskField } from "./task-fields.entity";
import { CreateFieldDto } from "./dto/taskFieldsDto";
import { FieldsValidation } from "./task-fieldValidation";

@ApiTags("Поля задач")
@ApiBearerAuth()
@Controller("task-fields")
export class TaskFieldsController {
  constructor(private taskFieldsService: TaskFieldsService) {}

  @ApiOperation({ summary: "Создание поля задачи" })
  @ApiResponse({ status: 200, type: TaskField })
  @UseGuards(JwtAuthGuard)
  @Post("/:project")
  create(
    @Body() fieldDto: CreateFieldDto,
    @Param("project", ParseIntPipe) project: number,
    @Req() request: Request
  ) {
    return this.taskFieldsService.createField(
      fieldDto,
      project,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Получение конкретного поля задачи" })
  @ApiResponse({ status: 200, type: TaskField })
  @Get("/:project/:field")
  @UseGuards(JwtAuthGuard)
  getField(@Query() params: FieldsValidation, @Req() request: Request) {
    return this.taskFieldsService.findField(
      params,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Получение всех полей" })
  @ApiResponse({ status: 200, type: [TaskField] })
  @Get("/:project")
  @UseGuards(JwtAuthGuard)
  getFields(
    @Param("project", ParseIntPipe) project: number,
    @Req() request: Request
  ) {
    return this.taskFieldsService.findAllFields(
      project,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Обновление поля задачи" })
  @ApiResponse({ status: 200, type: TaskField })
  @UseGuards(JwtAuthGuard)
  @Put("/:project/:field")
  update(
    @Body() fieldDto: CreateFieldDto,
    @Query() params: FieldsValidation,
    @Req() request: Request
  ) {
    return this.taskFieldsService.updateField(
      fieldDto,
      params,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Удаление поля задачи" })
  @ApiResponse({ status: 204 })
  @UseGuards(JwtAuthGuard)
  @Delete("/:project/:field")
  @HttpCode(204)
  delete(@Query() params: FieldsValidation, @Req() request: Request) {
    return this.taskFieldsService.deleteField(
      params,
      request.headers["authorization"]
    );
  }
}
