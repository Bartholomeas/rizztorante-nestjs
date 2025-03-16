import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "./entities/user.entity";
import { UsersService } from "./services/users.service";
import { UsersController } from "./users.controller";
import { UsersListener } from "./users.listener";
import { USER_REPOSITORY_DI } from "./repositories/user.repository";
import { TypeormUserRepository } from "./infra/typeom-user.repository";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    UsersListener,
    {
      provide: USER_REPOSITORY_DI,
      useClass: TypeormUserRepository,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
