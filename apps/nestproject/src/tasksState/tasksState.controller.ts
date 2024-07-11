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
import { TasksStateService } from "./tasksState.service";
import { CreateTasksStateDto } from "./dto/tasksStateDto";
import { JwtAuthGuard } from "apps/nestproject/src/auth/jswAuth.guard";
import {
  ParamsForReplaceOrder,
  ParamsForReplaceTask,
  ParamsValidation,
} from "./paramsValidation";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TaskState } from "./tasksState.entity";
import { Project } from "apps/nestproject/src/projects/projects.entity";
import { Task } from "apps/nestproject/src/tasks/tasks.entity";

@ApiTags("Состояния задач")
@ApiBearerAuth()
@Controller("tasksstate")
export class TasksStateController {
  constructor(private tasksStateService: TasksStateService) {}

  @ApiOperation({ summary: "Создание состояния задачи" })
  @ApiResponse({ status: 200, type: TaskState })
  @UseGuards(JwtAuthGuard)
  @Post("/:project")
  createState(
    @Body() stateDto: CreateTasksStateDto,
    @Param("project", ParseIntPipe) id: number,
    @Req() request: Request
  ) {
    return this.tasksStateService.createTaskState(
      stateDto,
      Number(id),
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Получить все состояния задач" })
  @ApiResponse({ status: 200, type: [TaskState] })
  @UseGuards(JwtAuthGuard)
  @Get("/:project")
  findAll(@Param("project", ParseIntPipe) id: number, @Req() request: Request) {
    return this.tasksStateService.findAllStates(
      Number(id),
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Получить конкретное состояние задач" })
  @ApiResponse({ status: 200, type: TaskState })
  @UseGuards(JwtAuthGuard)
  @Get("/:project/:state")
  findOne(@Query() params: ParamsValidation, @Req() request: Request) {
    return this.tasksStateService.findOneState(
      params,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Удаление состояния задачи" })
  @ApiResponse({ status: 204 })
  @UseGuards(JwtAuthGuard)
  @Delete("/:project/:state")
  @HttpCode(204)
  deleteState(@Query() params: ParamsValidation, @Req() request: Request) {
    return this.tasksStateService.deleteTaskState(
      params,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Обновление состояния задачи" })
  @ApiResponse({ status: 200, type: TaskState })
  @UseGuards(JwtAuthGuard)
  @Put("/:project/:state")
  updateState(
    @Query() params: ParamsValidation,
    @Body() stateDto: CreateTasksStateDto,
    @Req() request: Request
  ) {
    return this.tasksStateService.updateTaskState(
      params,
      stateDto,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Изменение порядка столбцов состояний задач" })
  @ApiResponse({ status: 200, type: Project })
  @UseGuards(JwtAuthGuard)
  @Post("/:project/:state/:place")
  replace(@Query() params: ParamsForReplaceOrder, @Req() request: Request) {
    return this.tasksStateService.replaceOrderState(
      params,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Изменения состояния задачи" })
  @ApiResponse({ status: 200, type: Task })
  @UseGuards(JwtAuthGuard)
  @Post("/:project/:target/:state/:place")
  dragTask(@Query() params: ParamsForReplaceTask, @Req() request: Request) {
    return this.tasksStateService.dragTaskBetweenStates(
      params,
      request.headers["authorization"]
    );
  }
}
