import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CategoryDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ description: "Optional description for the category", nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  menuId: string;
}
