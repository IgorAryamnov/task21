import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./roles.entity";
import { JwtLibraryModule } from "@app/jwt-library";

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [TypeOrmModule.forFeature([Role]), JwtLibraryModule],
  exports: [RolesService],
})
export class RolesModule {}
