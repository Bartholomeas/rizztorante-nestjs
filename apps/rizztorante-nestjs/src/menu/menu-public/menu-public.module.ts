import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MenuCategory } from "@app/restaurant/menu/entities/menu-category.entity";
import { MenuPositionDetails } from "@app/restaurant/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@app/restaurant/menu/entities/menu-position.entity";
import { Menu } from "@app/restaurant/menu/entities/menu.entity";
import { MenuPublicController } from "@app/restaurant/menu/menu-public/menu-public.controller";
import { MenuPublicService } from "@app/restaurant/menu/menu-public/menu-public.service";

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuCategory, MenuPosition, MenuPositionDetails])],
  providers: [MenuPublicService],
  controllers: [MenuPublicController],
})
export class MenuPublicModule {}
