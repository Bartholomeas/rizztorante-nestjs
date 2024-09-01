import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "./entity/user.entity";
import { SessionSerializer } from "./session.serializer";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
