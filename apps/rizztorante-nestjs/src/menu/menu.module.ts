import { Module } from "@nestjs/common";

import { MenuAdminModule } from "@app/restaurant/menu/menu-admin/menu-admin.module";
import { MenuPublicModule } from "@app/restaurant/menu/menu-public/menu-public.module";

@Module({
  imports: [MenuPublicModule, MenuAdminModule],
})
export class MenuModule {}
