import { ApiPaginatedResponse } from "@common/decorators/api-paginated-response.decorator";
import { IsPublic } from "@common/decorators/is-public.decorator";
import { PageOptionsWithSearchDto } from "@common/dto/pagination/page-options-with-search.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";

import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { IngredientDto } from "./dto/ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { INGREDIENTS_ALLOWED_ROLES } from "./ingredients.constants";
import { IngredientsService } from "./ingredients.service";

@Controller("ingredients")
@ApiTags("Ingredients")
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all ingredients" })
  @ApiPaginatedResponse(IngredientDto)
  findAll(@Query() pageOptionsDto: PageOptionsWithSearchDto) {
    return this.ingredientsService.findAllIngredients(pageOptionsDto);
  }

  @Roles(...INGREDIENTS_ALLOWED_ROLES)
  @UseGuards(RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create ingredient (restricted)" })
  @ApiResponse({
    type: [CreateIngredientDto],
  })
  @ApiSecurity("Roles")
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.createIngredient(createIngredientDto);
  }

  @Roles(...INGREDIENTS_ALLOWED_ROLES)
  @UseGuards(RolesGuard)
  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update ingredient (restricted)" })
  @ApiResponse({
    type: [UpdateIngredientDto],
  })
  @ApiSecurity("Roles")
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.updateIngredient(id, updateIngredientDto);
  }

  @Roles(...INGREDIENTS_ALLOWED_ROLES)
  @UseGuards(RolesGuard)
  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete ingredient (restricted)" })
  @ApiSecurity("Roles")
  delete(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.ingredientsService.deleteIngredient(id);
  }
}
