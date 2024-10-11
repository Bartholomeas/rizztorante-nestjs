import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MenuCategory } from "@/menu/entities/menu-category.entity";
import { MenuPositionDetails } from "@/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@/menu/entities/menu-position.entity";
import { Menu } from "@/menu/entities/menu.entity";
import { MenuPublicController } from "@/menu/menu-public/menu-public.controller";
import { MenuPublicService } from "@/menu/menu-public/menu-public.service";
import { Restaurant } from "@/restaurants/entities/restaurant.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, MenuCategory, MenuPosition, MenuPositionDetails, Restaurant]),
  ],
  providers: [MenuPublicService],
  controllers: [MenuPublicController],
})
export class MenuPublicModule {}
