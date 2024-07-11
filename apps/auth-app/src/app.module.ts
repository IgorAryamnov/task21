import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthAppModule } from "./auth-app/auth-app.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "db",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "postgres",
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthAppModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
