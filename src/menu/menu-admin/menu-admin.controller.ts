import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateMenuDto } from "@/menu/menu-admin/dto/create-menu.dto";
import { MenuAdminService } from "@/menu/menu-admin/menu-admin.service";
import { CreateMenuCategoryDto } from "@/menu/menu-admin/dto/create-category.dto";

@ApiTags("Menu Admin")
@Controller("menu-admin")
export class MenuAdminController {
  constructor(private readonly menuService: MenuAdminService) {}

  @Post("create-menu")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create menu" })
  createMenu(@Body(ValidationPipe) createMenuDto: CreateMenuDto) {
    try {
      return this.menuService.createMenu(createMenuDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Post("create-category")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create menu category" })
  createCategory(@Body(ValidationPipe) createMenuCategoryDto: CreateMenuCategoryDto) {
    return this.menuService.createCategory(createMenuCategoryDto);
  }

  @Post("create-position")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create position in specified category" })
  createPosition() {
    return this.menuService.createPosition();
  }
}
