import { Module } from "@nestjs/common";
import { AuthAppController } from "./auth-app.controller";
import { AuthAppService } from "./auth-app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { JwtLibraryModule } from "@app/jwt-library";
import { Role } from "./roles.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), JwtLibraryModule],
  controllers: [AuthAppController],
  providers: [AuthAppService],
})
export class AuthAppModule {}
