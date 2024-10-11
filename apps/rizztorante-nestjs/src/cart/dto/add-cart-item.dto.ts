import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";

import { CreateCartItemConfigurableIngredientDto } from "./create-cart-item-configurable-ingredient.dto";

export class AddCartItemDto {
  @ApiProperty({ default: "00000000-0000-0000-0000-000000000000" })
  @IsNotEmpty()
  @IsUUID()
  menuPositionId: string;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ type: [CreateCartItemConfigurableIngredientDto], isArray: true, default: [] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemConfigurableIngredientDto)
  configurableIngredients?: CreateCartItemConfigurableIngredientDto[];
}
