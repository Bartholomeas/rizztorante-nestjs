import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateMenuCategoryDto } from "@/menu/menu-admin/dto/create/create-category.dto";
import { CreateMenuDto } from "@/menu/menu-admin/dto/create/create-menu.dto";
import { CreateMenuPositionDto } from "@/menu/menu-admin/dto/create/create-position.dto";
import { MenuAdminService } from "@/menu/menu-admin/menu-admin.service";

import { UpdateMenuCategoryDto } from "./dto/update/update-category.dto";
import { UpdateMenuDto } from "./dto/update/update-menu.dto";
import { UpdateMenuPositionDto } from "./dto/update/update-position.dto";

@ApiTags("Menu Admin")
@Controller("menu-admin")
export class MenuAdminController {
  constructor(private readonly menuService: MenuAdminService) {}

  @Post("menu")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create menu" })
  async createMenu(@Body(ValidationPipe) createMenuDto: CreateMenuDto) {
    try {
      return await this.menuService.createMenu(createMenuDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Post("category")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create menu category" })
  async createCategory(@Body(ValidationPipe) createMenuCategoryDto: CreateMenuCategoryDto) {
    try {
      return await this.menuService.createCategory(createMenuCategoryDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Post("position")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create position in specified category" })
  async createPosition(@Body(ValidationPipe) createMenuPositionDto: CreateMenuPositionDto) {
    try {
      return await this.menuService.createPosition(createMenuPositionDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Delete("menu/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete menu" })
  async deleteMenu(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      await this.menuService.deleteMenu(id);
      return;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Delete("category/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete menu category" })
  async deleteCategory(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      await this.menuService.deleteCategory(id);
      return;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Delete("position/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete menu position" })
  async deletePosition(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      await this.menuService.deletePosition(id);
      return;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Put("menu/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update menu" })
  async updateMenu(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateMenuDto: UpdateMenuDto,
  ) {
    try {
      return await this.menuService.updateMenu(id, updateMenuDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Put("category/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update menu category" })
  async updateCategory(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateMenuCategoryDto: UpdateMenuCategoryDto,
  ) {
    try {
      return await this.menuService.updateCategory(id, updateMenuCategoryDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Put("position/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update menu position" })
  async updatePosition(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateMenuPositionDto: UpdateMenuPositionDto,
  ) {
    try {
      return await this.menuService.updatePosition(id, updateMenuPositionDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
