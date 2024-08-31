import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MenuCategory } from "@/menu/entity/menu-category.entity";
import { MenuPosition } from "@/menu/entity/menu-position.entity";
import { Menu } from "@/menu/entity/menu.entity";
import { MenuPublicController } from "@/menu/menu-public/menu-public.controller";
import { MenuPublicService } from "@/menu/menu-public/menu-public.service";

import { MenuPositionDetails } from "../entity/menu-position-details.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuCategory, MenuPosition, MenuPositionDetails])],
  providers: [MenuPublicService],
  controllers: [MenuPublicController],
})
export class MenuPublicModule {}
