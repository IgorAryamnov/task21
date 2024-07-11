import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/taskDto";
import { JwtAuthGuard } from "apps/nestproject/src/auth/jswAuth.guard";
import {
  ParamsOrderValidation,
  ParamsUpdateValidation,
  ParamsValidation,
} from "./tasksParamsValidate";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Task } from "./tasks.entity";

@ApiTags("Задачи")
@ApiBearerAuth()
@Controller("tasks")
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @ApiOperation({ summary: "Создание задачи" })
  @ApiResponse({ status: 200, type: Task })
  @UseGuards(JwtAuthGuard)
  @Post("/:project/:state")
  create(
    @Body() taskDto: CreateTaskDto,
    @Query() params: ParamsValidation,
    @Req() request: Request
  ) {
    return this.tasksService.createTask(
      taskDto,
      params,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Получение всех задач" })
  @ApiResponse({ status: 200, type: [Task] })
  @UseGuards(JwtAuthGuard)
  @Get("/:project/:state")
  findAll(@Query() params: ParamsValidation, @Req() request: Request) {
    return this.tasksService.findTasks(
      params,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Получение конкретной задачи" })
  @ApiResponse({ status: 200, type: Task })
  @UseGuards(JwtAuthGuard)
  @Get("/:project/:state/:target")
  findOne(@Query() params: ParamsUpdateValidation, @Req() request: Request) {
    return this.tasksService.findTask(params, request.headers["authorization"]);
  }

  @ApiOperation({ summary: "Обновление задачи" })
  @ApiResponse({ status: 200, type: Task })
  @UseGuards(JwtAuthGuard)
  @Put("/:project/:state/:target")
  update(
    @Body() taskDto: CreateTaskDto,
    @Query() params: ParamsUpdateValidation,
    @Req() request: Request
  ) {
    return this.tasksService.updateTask(
      taskDto,
      params,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Удаление задачи" })
  @ApiResponse({ status: 204 })
  @UseGuards(JwtAuthGuard)
  @Delete("/:project/:state/:target")
  @HttpCode(204)
  delete(@Query() params: ParamsUpdateValidation, @Req() request: Request) {
    return this.tasksService.deleteTask(
      params,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "drag and drop задачи" })
  @ApiResponse({ status: 200, type: Task })
  @UseGuards(JwtAuthGuard)
  @Post("/:project/:state/:target/:place")
  swap(@Query() params: ParamsOrderValidation, @Req() request: Request) {
    return this.tasksService.dragTask(params, request.headers["authorization"]);
  }
}
