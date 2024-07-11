import { Module } from "@nestjs/common";
import { TaskFieldsService } from "./task-fields.service";
import { TaskFieldsController } from "./task-fields.controller";
import { TaskField } from "./task-fields.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "apps/nestproject/src/projects/projects.entity";
import { TaskFieldValue } from "./task-field-values.entity";
import { Task } from "apps/nestproject/src/tasks/tasks.entity";
import { SelectiveFieldValues } from "./selectiveField.entity";
import { JwtLibraryModule } from "@app/jwt-library";

@Module({
  providers: [TaskFieldsService],
  controllers: [TaskFieldsController],
  imports: [
    TypeOrmModule.forFeature([
      TaskField,
      TaskFieldValue,
      Task,
      Project,
      SelectiveFieldValues,
    ]),
    JwtLibraryModule,
  ],
})
export class TaskFieldsModule {}
