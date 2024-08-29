import { Controller, Get } from "@nestjs/common";

import { MenuService } from "@/menu/menu.service";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getAll() {
    return this.menuService.getAll();
  }
}
