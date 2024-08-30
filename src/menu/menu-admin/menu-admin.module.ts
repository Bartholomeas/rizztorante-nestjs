import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { Menu } from "@/menu/entity/menu.entity";
import { MenuCategory } from "@/menu/entity/menu-category.entity";
import { MenuPosition } from "@/menu/entity/menu-position.entity";
import { MenuAdminService } from "@/menu/menu-admin/menu-admin.service";
import { MenuAdminController } from "@/menu/menu-admin/menu-admin.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuCategory, MenuPosition])],
  providers: [MenuAdminService],
  controllers: [MenuAdminController],
})
export class MenuAdminModule {}
