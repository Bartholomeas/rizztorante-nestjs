import { Body, Controller, Get, HttpCode, HttpStatus, Post, ValidationPipe } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { MenuService } from "@/menu/menu.service";
import { CreateMenuDto } from "@/menu/dto/create-menu.dto";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getAll() {
    return this.menuService.getAll();
  }

  @Post("create-menu")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create menu" })
  createMenu(@Body(ValidationPipe) createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Post("create-category")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create menu category" })
  createCategory() {
    return this.menuService.createCategory();
  }

  @Post("create-position")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create position in specified category" })
  createPosition() {
    return this.menuService.createPosition();
  }
}
