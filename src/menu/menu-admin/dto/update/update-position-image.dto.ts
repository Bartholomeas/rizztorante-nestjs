import { ApiProperty } from "@nestjs/swagger";

import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdatePositionImageDto {
  @ApiProperty({
    description: "The unique identifier of the position image",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "The URL of the position image",
    example: "https://example.com/image.jpg",
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: "The alternative text for the position image",
    example: "Image description",
    required: false,
  })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiProperty({
    description: "The caption for the position image",
    example: "Image caption",
    required: false,
  })
  @IsString()
  @IsOptional()
  caption?: string;
}
