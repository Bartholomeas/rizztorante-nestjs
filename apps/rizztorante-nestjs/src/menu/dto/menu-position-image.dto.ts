import { ApiProperty } from "@nestjs/swagger";

export class MenuPositionImageDto {
  @ApiProperty({
    description: "The unique identifier for the menu position image",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "The URL of the menu position image",
    example: "https://example.com/image.jpg",
  })
  url: string;

  @ApiProperty({
    description: "The alternative text for the menu position image",
    nullable: true,
  })
  alt?: string;

  @ApiProperty({
    description: "The caption for the menu position image",
    nullable: true,
  })
  caption?: string;
}
