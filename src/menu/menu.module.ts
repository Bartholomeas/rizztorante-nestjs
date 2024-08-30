import { Module } from "@nestjs/common";

import { MenuPublicModule } from "@/menu/menu-public/menu-public.module";
import { MenuAdminModule } from "@/menu/menu-admin/menu-admin.module";

@Module({
  imports: [MenuPublicModule, MenuAdminModule],
})
export class MenuModule {}
