import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Menu } from "@/menu/entities/menu.entity";
import { MenuController } from "@/menu/menu.controller";
import { MenuService } from "@/menu/menu.service";

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
