import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { MenuPublicService } from "@/menu/menu-public/menu-public.service";

@ApiTags("Menu Public")
@Controller("menus")
export class MenuPublicController {
  constructor(private readonly menuService: MenuPublicService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all menus" })
  async getAllMenus() {
    try {
      return await this.menuService.getMenus();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Get(":menuId/categories")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all categories for a specific menu" })
  async getMenuCategories(@Param("menuId", new ParseUUIDPipe()) menuId: string) {
    try {
      return await this.menuService.getMenuCategories(menuId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Get("categories/:categoryId/positions")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all positions for a specific category" })
  async getCategoryPositions(@Param("categoryId", new ParseUUIDPipe()) categoryId: string) {
    try {
      return await this.menuService.getPositions(categoryId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Get("positions/:positionId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get details of a specific position" })
  async getPositionDetails(@Param("positionId", new ParseUUIDPipe()) positionId: string) {
    try {
      return await this.menuService.getPositionDetails(positionId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
