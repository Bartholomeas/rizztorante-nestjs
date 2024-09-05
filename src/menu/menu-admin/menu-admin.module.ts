import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MenuCategory } from "@/menu/entities/menu-category.entity";
import { MenuPositionDetails } from "@/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@/menu/entities/menu-position.entity";
import { Menu } from "@/menu/entities/menu.entity";
import { MenuAdminController } from "@/menu/menu-admin/menu-admin.controller";
import { MenuAdminService } from "@/menu/menu-admin/menu-admin.service";

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuCategory, MenuPosition, MenuPositionDetails])],
  providers: [MenuAdminService],
  controllers: [MenuAdminController],
})
export class MenuAdminModule {}
