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

import { CreateIngredientsConfigurationDto } from "./dto/create-ingredients-configuration.dto";
import { UpdateIngredientsConfigurationDto } from "./dto/update-ingredients-configuration.dto";
import { IngredientsConfiguration } from "./entities/ingredients-configuration.entity";
import { IngredientsConfigurationService } from "./ingredients-configuration.service";

@Controller("ingredients-configuration")
@ApiTags("Ingredients Configuration")
export class IngredientsConfigurationController {
  constructor(private readonly ingredientsConfigurationService: IngredientsConfigurationService) {}

  @Get()
  @ApiOperation({ summary: "Find ingredients configuration for menu position" })
  async findMenuPositionConfiguration(
    @Query("menuPositionId", new ParseUUIDPipe()) menuPositionId: string,
  ) {
    try {
      return this.ingredientsConfigurationService.findMenuPositionConfiguration(menuPositionId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get("/all")
  @ApiOperation({ summary: "Find all ingredients configuration" })
  @ApiPaginatedResponse(IngredientsConfiguration)
  async findAllConfigurations(@Query() pageOptionsDto: PageOptionsWithSearchDto) {
    try {
      return await this.ingredientsConfigurationService.findAllConfigurations(pageOptionsDto);
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
  async createConfiguration(
    @Body() createIngredientsConfigurationDto: CreateIngredientsConfigurationDto,
  ) {
    try {
      return this.ingredientsConfigurationService.createConfiguration(
        createIngredientsConfigurationDto,
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
    @Body() updateIngredientsConfigurationDto: UpdateIngredientsConfigurationDto,
  ) {
    try {
      return this.ingredientsConfigurationService.updateConfiguration(
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
      return this.ingredientsConfigurationService.deleteConfiguration(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
