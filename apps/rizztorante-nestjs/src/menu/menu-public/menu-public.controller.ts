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
import { ApiOperation, ApiResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";

import { MenuPublicService } from "@app/restaurant/menu/menu-public/menu-public.service";

import { CategoryDto } from "../dto/category.dto";
import { MenuPositionDto } from "../dto/menu-position.dto";
import { MenuDto } from "../dto/menu.dto";
import { PositionDetailsDto } from "../dto/position-details.dto";

@ApiTags("Menu Public")
@Controller("menus")
export class MenuPublicController {
  constructor(private readonly menuService: MenuPublicService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all menus" })
  @ApiResponse({
    type: [MenuDto],
  })
  async getAllMenus(): Promise<MenuDto[]> {
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
  @ApiResponse({
    type: CategoryDto,
    isArray: true,
    schema: {
      $ref: getSchemaPath(CategoryDto),
    },
  })
  async getMenuCategories(
    @Param("menuId", new ParseUUIDPipe()) menuId: string,
  ): Promise<CategoryDto[]> {
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
  @ApiResponse({
    type: [MenuPositionDto],
  })
  async getCategoryPositions(
    @Param("categoryId", new ParseUUIDPipe()) categoryId: string,
  ): Promise<MenuPositionDto[]> {
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
  @ApiResponse({
    type: PositionDetailsDto,
  })
  async getPositionDetails(
    @Param("positionId", new ParseUUIDPipe()) positionId: string,
  ): Promise<PositionDetailsDto> {
    try {
      return await this.menuService.getPositionDetails(positionId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
