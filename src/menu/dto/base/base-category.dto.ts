import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export abstract class BaseCategoryDto {
  @ApiProperty({ description: "The name of the category", example: "Beverages", nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({
    description: "Optional description for the category",
    example: "A selection of drinks",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "The unique identifier for the menu this category belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @Exclude()
  menuId: string;
}
