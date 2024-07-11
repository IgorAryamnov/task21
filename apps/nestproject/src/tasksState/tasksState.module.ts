import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskState } from "../tasksState/tasksState.entity";
import { Project } from "apps/nestproject/src/projects/projects.entity";
import { TasksStateService } from "./tasksState.service";
import { TasksStateController } from "./tasksState.controller";
import { Task } from "apps/nestproject/src/tasks/tasks.entity";
import { JwtLibraryModule } from "@app/jwt-library";

@Module({
  providers: [TasksStateService],
  controllers: [TasksStateController],
  imports: [
    TypeOrmModule.forFeature([TaskState, Project, Task]),
    JwtLibraryModule,
  ],
})
export class TasksStateModule {}
