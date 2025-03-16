import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MenuCategory } from "@/menu/entities/menu-category.entity";
import { MenuPositionDetails } from "@/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@/menu/entities/menu-position.entity";
import { Menu } from "@/menu/entities/menu.entity";
import { MenuPublicController } from "@/menu/menu-public/menu-public.controller";
import { MenuPublicService } from "@/menu/menu-public/menu-public.service";
import { Restaurant } from "@/restaurants/entities/restaurant.entity";
import { MENU_REPOSITORY_DI } from "../repositories/menu.repository";
import { TypeormMenuRepository } from "../infra/typeorm-menu.repository";
import { MENU_CATEGORY_REPOSITORY_DI } from "../repositories/menu-category.repository";
import { TypeormMenuCategoryRepository } from "../infra/typeorm-menu-category.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, MenuCategory, MenuPosition, MenuPositionDetails, Restaurant]),
  ],
  providers: [
    MenuPublicService,
    {
      provide: MENU_REPOSITORY_DI,
      useClass: TypeormMenuRepository,
    },
    {
      provide: MENU_CATEGORY_REPOSITORY_DI,
      useClass: TypeormMenuCategoryRepository,
    },
  ],
  controllers: [MenuPublicController],
})
export class MenuPublicModule {}
