import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Menu } from "@/menu/entity/menu.entity";
import { MenuController } from "@/menu/menu.controller";
import { MenuService } from "@/menu/menu.service";
import { MenuPosition } from "@/menu/entity/menu-position.entity";
import { MenuCategory } from "@/menu/entity/menu-category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuCategory, MenuPosition])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
