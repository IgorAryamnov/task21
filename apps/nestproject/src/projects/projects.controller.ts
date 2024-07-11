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
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ProjectsService } from "./projects.service";
import { Project } from "./projects.entity";
import { CreateProjectDto } from "./dto/projectDto";
import { JwtAuthGuard } from "apps/nestproject/src/auth/jswAuth.guard";

@ApiTags("Проекты")
@ApiBearerAuth()
@Controller("projects")
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @ApiOperation({ summary: "Создание проекта" })
  @ApiResponse({ status: 200, type: Project })
  @Post()
  @UseGuards(JwtAuthGuard)
  createProject(@Body() projectDto: CreateProjectDto, @Req() request: Request) {
    return this.projectService.createProject(
      projectDto,
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Удаление проекта" })
  @ApiResponse({ status: 204 })
  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  deleteProject(
    @Param("id", ParseIntPipe) id: number,
    @Req() request: Request
  ) {
    return this.projectService.deleteProject(
      Number(id),
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Получение конкретного проекта" })
  @ApiResponse({ status: 200, type: Project })
  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  getProject(@Param("id", ParseIntPipe) id: number, @Req() request: Request) {
    return this.projectService.findProject(
      Number(id),
      request.headers["authorization"]
    );
  }

  @ApiOperation({ summary: "Получение всех проектов" })
  @ApiResponse({ status: 200, type: [Project] })
  @Get()
  @UseGuards(JwtAuthGuard)
  getProjects(@Req() request: Request) {
    return this.projectService.findAll(request.headers["authorization"]);
  }

  @ApiOperation({ summary: "Обновить информацию о проекте" })
  @ApiResponse({ status: 200, type: Project })
  @Put("/:id")
  @UseGuards(JwtAuthGuard)
  updateProject(
    @Param("id", ParseIntPipe) id: number,
    @Body() projectDto: CreateProjectDto,
    @Req() request: Request
  ) {
    return this.projectService.update(
      Number(id),
      projectDto,
      request.headers["authorization"]
    );
  }
}
