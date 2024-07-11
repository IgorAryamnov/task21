import { Module } from "@nestjs/common";
import { JwtLibraryService } from "./jwt-library.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: "SuperSecretKey",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  providers: [JwtLibraryService],
  exports: [JwtLibraryService, JwtModule],
})
export class JwtLibraryModule {}
