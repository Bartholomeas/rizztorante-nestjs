import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersListener } from "./users.listener";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersListener],
  controllers: [UsersController],
})
export class UsersModule {}
