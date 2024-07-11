import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { User } from "./users/users.entity";
import { RolesModule } from "./roles/roles.module";
import { Role } from "./roles/roles.entity";
import { AuthModule } from "./auth/auth.module";
import { ProjectsModule } from "./projects/projects.module";
import { Project } from "./projects/projects.entity";
import { TasksModule } from "./tasks/tasks.module";
import { Task } from "./tasks/tasks.entity";
import { TaskState } from "./tasksState/tasksState.entity";
import { TasksStateModule } from "./tasksState/tasksState.module";
import { TaskFieldsModule } from "./task-fields/task-fields.module";
import { TaskField } from "./task-fields/task-fields.entity";
import { TaskFieldValue } from "./task-fields/task-field-values.entity";
import { SelectiveFieldValues } from "./task-fields/selectiveField.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "db",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "postgres",
      entities: [
        User,
        Role,
        Project,
        Task,
        TaskState,
        TaskField,
        TaskFieldValue,
        SelectiveFieldValues,
      ],
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    TasksStateModule,
    TaskFieldsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
