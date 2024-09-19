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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "@common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "@common/dto/pagination/page-options.dto";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";

import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { IngredientDto } from "./dto/ingredient-dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { INGREDIENTS_ALLOWED_ROLES } from "./ingredients.constants";
import { IngredientsService } from "./ingredients.service";

@Controller("ingredients")
@ApiTags("Ingredients")
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all ingredients" })
  @ApiPaginatedResponse(IngredientDto)
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return this.ingredientsService.findAll(pageOptionsDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(...INGREDIENTS_ALLOWED_ROLES)
  @UseGuards(RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create ingredient (restricted)" })
  @ApiResponse({
    type: [CreateIngredientDto],
  })
  create(@Body() createIngredientDto: CreateIngredientDto) {
    try {
      return this.ingredientsService.create(createIngredientDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Roles(...INGREDIENTS_ALLOWED_ROLES)
  @UseGuards(RolesGuard)
  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update ingredient (restricted)" })
  @ApiResponse({
    type: [UpdateIngredientDto],
  })
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    try {
      return this.ingredientsService.update(id, updateIngredientDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Roles(...INGREDIENTS_ALLOWED_ROLES)
  @UseGuards(RolesGuard)
  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete ingredient (restricted)" })
  delete(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.ingredientsService.delete(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
