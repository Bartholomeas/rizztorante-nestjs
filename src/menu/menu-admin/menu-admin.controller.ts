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
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { UserRole } from "@/common/types/user-roles.types";
import { CreateMenuCategoryDto } from "@/menu/menu-admin/dto/create/create-category.dto";
import { CreateMenuDto } from "@/menu/menu-admin/dto/create/create-menu.dto";
import { CreateMenuPositionDto } from "@/menu/menu-admin/dto/create/create-position.dto";
import { MenuAdminService } from "@/menu/menu-admin/menu-admin.service";

import { CreateMenuPositionDetailsDto } from "./dto/update/create-position-details.dto";
import { UpdateMenuCategoryDto } from "./dto/update/update-category.dto";
import { UpdateMenuDto } from "./dto/update/update-menu.dto";
import { UpdateMenuPositionDetailsDto } from "./dto/update/update-position-details.dto";
import { UpdateMenuPositionDto } from "./dto/update/update-position.dto";

@ApiTags("Menu Admin")
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller("admin/menus")
export class MenuAdminController {
  constructor(private readonly menuService: MenuAdminService) {}

  @Post()
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

  @Post("categories")
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

  @Post("positions")
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

  @Post("positions/:id/details")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create position details" })
  async createPositionDetails(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) createMenuPositionDetailsDto: CreateMenuPositionDetailsDto,
  ) {
    return await this.menuService.createPositionDetails(id, createMenuPositionDetailsDto);
  }

  @Delete(":id")
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

  @Delete("categories/:id")
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

  @Delete("positions/:id")
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

  @Put(":id")
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

  @Put("categories/:id")
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

  @Put("positions/:id")
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

  @Put("positions/:id/details")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update menu position" })
  async updatePositionDetails(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateMenuPositionDetailsDto: UpdateMenuPositionDetailsDto,
  ) {
    try {
      return await this.menuService.updatePositionDetails(id, updateMenuPositionDetailsDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
