import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { MenuPublicService } from "@/menu/menu-public/menu-public.service";

@ApiTags("Menu Public")
@Controller("menu-public")
export class MenuPublicController {
  constructor(private readonly menuService: MenuPublicService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all menus" })
  async getMenus() {
    try {
      return await this.menuService.getMenus();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Get("categories")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all menu categories" })
  async getMenuCategories() {
    try {
      return await this.menuService.getMenuCategories();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
