import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MenuCategory } from "@app/restaurant/menu/entities/menu-category.entity";
import {
  MenuPositionDetailsImage,
  MenuPositionImage,
} from "@app/restaurant/menu/entities/menu-images.entity";
import { MenuPositionDetails } from "@app/restaurant/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@app/restaurant/menu/entities/menu-position.entity";
import { Menu } from "@app/restaurant/menu/entities/menu.entity";
import { MenuAdminController } from "@app/restaurant/menu/menu-admin/menu-admin.controller";
import { MenuAdminService } from "@app/restaurant/menu/menu-admin/menu-admin.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Menu,
      MenuCategory,
      MenuPosition,
      MenuPositionDetails,
      MenuPositionImage,
      MenuPositionDetailsImage,
    ]),
  ],
  providers: [MenuAdminService],
  controllers: [MenuAdminController],
})
export class MenuAdminModule {}
