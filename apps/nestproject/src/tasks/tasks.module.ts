import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./tasks.entity";
import { TaskState } from "../tasksState/tasksState.entity";
import { Project } from "apps/nestproject/src/projects/projects.entity";
import { TaskFieldValue } from "apps/nestproject/src/task-fields/task-field-values.entity";
import { JwtLibraryModule } from "@app/jwt-library";

@Module({
  providers: [TasksService],
  controllers: [TasksController],
  imports: [
    TypeOrmModule.forFeature([Task, TaskState, Project, TaskFieldValue]),
    JwtLibraryModule,
  ],
})
export class TasksModule {}
