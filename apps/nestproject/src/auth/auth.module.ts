import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { JwtLibraryModule } from "@app/jwt-library";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    JwtLibraryModule,
    ClientsModule.register([
      {
        name: "AUTH_CLIENT",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://rabbitmq:5672"],
          queue: "auth_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
})
export class AuthModule {}
