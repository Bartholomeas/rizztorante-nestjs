import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class ApproveOpinionDto {
  @ApiProperty({ default: true })
  @IsBoolean()
  isApproved: boolean;
}
