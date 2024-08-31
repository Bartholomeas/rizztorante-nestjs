import { Module } from "@nestjs/common";

import { MenuAdminModule } from "@/menu/menu-admin/menu-admin.module";
import { MenuPublicModule } from "@/menu/menu-public/menu-public.module";

@Module({
  imports: [MenuPublicModule, MenuAdminModule],
})
export class MenuModule {}
