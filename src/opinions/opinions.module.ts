import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Opinion } from "./entities/opinion.entity";
import { OpinionsController } from "./opinions.controller";
import { OpinionsService } from "./opinions.service";

@Module({
  imports: [TypeOrmModule.forFeature([Opinion])],
  controllers: [OpinionsController],
  providers: [OpinionsService],
})
export class OpinionsModule {}
