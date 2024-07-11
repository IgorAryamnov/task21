import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { RolesModule } from "apps/nestproject/src/roles/roles.module";
import { JwtLibraryModule } from "@app/jwt-library";

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule, JwtLibraryModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
