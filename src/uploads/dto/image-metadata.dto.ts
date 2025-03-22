import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ImageMetadataDto {
  @ApiProperty({ description: "URL of uploaded image" })
  @IsString()
  url: string;

  @ApiProperty({ description: "Alt attribute of uploaded image" })
  @IsString()
  alt?: string;

  @ApiProperty({ description: "Caption of uploaded image" })
  @IsString()
  caption?: string;
}
