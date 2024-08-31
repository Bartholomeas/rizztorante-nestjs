import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MenuCategory } from "@/menu/entity/menu-category.entity";
import { MenuPosition } from "@/menu/entity/menu-position.entity";
import { Menu } from "@/menu/entity/menu.entity";
import { MenuAdminController } from "@/menu/menu-admin/menu-admin.controller";
import { MenuAdminService } from "@/menu/menu-admin/menu-admin.service";

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuCategory, MenuPosition])],
  providers: [MenuAdminService],
  controllers: [MenuAdminController],
})
export class MenuAdminModule {}
