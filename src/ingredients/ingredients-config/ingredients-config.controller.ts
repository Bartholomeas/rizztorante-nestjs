import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "@common/decorators/api-paginated-response.decorator";
import { PageOptionsWithSearchDto } from "@common/dto/pagination/page-options-with-search.dto";
import { UserRole } from "@common/types/user-roles.type";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";

import { CreateConfigurableIngredientDto } from "./dto/create-configurable-ingredient.dto";
import { CreateIngredientsConfigDto } from "./dto/create-ingredients-config.dto";
import { UpdateIngredientsConfigDto } from "./dto/update-ingredients-config.dto";
import { IngredientsConfig } from "./entities/ingredients-config.entity";
import { IngredientsConfigService } from "./ingredients-config.service";

@Controller("ingredients-config")
@ApiTags("Ingredients Config")
export class IngredientsConfigController {
  constructor(private readonly ingredientsConfigService: IngredientsConfigService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: "Find all ingredients configuration (restricted)" })
  @ApiPaginatedResponse(IngredientsConfig)
  async findAllConfigurations(@Query() pageOptionsDto: PageOptionsWithSearchDto) {
    try {
      return await this.ingredientsConfigService.findAllConfigurations(pageOptionsDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Get("/:id")
  @ApiOperation({ summary: "Get configuration by id" })
  async findConfiguration(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.ingredientsConfigService.findConfiguration(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Get("/menu-position/:menuPositionId")
  @ApiOperation({ summary: "Find ingredients configuration for menu position" })
  async findMenuPositionConfiguration(
    @Param("menuPositionId", new ParseUUIDPipe()) menuPositionId: string,
  ) {
    try {
      return this.ingredientsConfigService.findMenuPositionConfiguration(menuPositionId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post("/custom-ingredient/:ingredientId")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create new configurable ingredients" })
  async createConfigurableIngredient(
    @Param("ingredientId", new ParseUUIDPipe()) ingredientId: string,
    @Body() createConfigurableIngredientDto: CreateConfigurableIngredientDto,
  ) {
    try {
      return this.ingredientsConfigService.createConfigurableIngredient(
        ingredientId,
        createConfigurableIngredientDto,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create new ingredients configuration" })
  async createConfiguration(@Body() createIngredientsConfigurationDto: CreateIngredientsConfigDto) {
    try {
      return this.ingredientsConfigService.createConfiguration(createIngredientsConfigurationDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post("/:configId/configurable-ingredient/:configurableIngredientId")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add configurable ingredient to configuration" })
  async addConfigurableIngredientToConfig(
    @Param("configId", new ParseUUIDPipe()) configId: string,
    @Param("configurableIngredientId", new ParseUUIDPipe()) configurableIngredientId: string,
  ) {
    try {
      return await this.ingredientsConfigService.addConfigurableIngredientToConfig(
        configId,
        configurableIngredientId,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete("/:configId/configurable-ingredient/:configurableIngredientId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove configurable ingredient from configuration" })
  async removeConfigurableIngredientFromConfig(
    @Param("configId", new ParseUUIDPipe()) configId: string,
    @Param("configurableIngredientId", new ParseUUIDPipe()) configurableIngredientId: string,
  ) {
    try {
      return await this.ingredientsConfigService.removeConfigurableIngredientFromConfig(
        configId,
        configurableIngredientId,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update ingredients configuration" })
  async updateConfiguration(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateIngredientsConfigurationDto: UpdateIngredientsConfigDto,
  ) {
    try {
      return this.ingredientsConfigService.updateConfiguration(
        id,
        updateIngredientsConfigurationDto,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete ingredients configuration" })
  async deleteConfiguration(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.ingredientsConfigService.deleteConfiguration(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
