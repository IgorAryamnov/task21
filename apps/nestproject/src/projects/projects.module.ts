import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./projects.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { JwtLibraryModule } from "@app/jwt-library";

@Module({
  providers: [ProjectsService],
  controllers: [ProjectsController],
  imports: [TypeOrmModule.forFeature([Project]), JwtLibraryModule],
})
export class ProjectsModule {}
