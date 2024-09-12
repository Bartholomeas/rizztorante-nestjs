import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CategoryDto {
  @ApiProperty({ description: "The name of the category", example: "Beverages" })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({
    description: "Optional description for the category",
    nullable: true,
    example: "A selection of drinks",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "The unique identifier for the menu this category belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  menuId: string;
}
