import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { UploadsService } from "./uploads.service";

@Controller("uploads")
@ApiTags("Uploads")
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get file" })
  async getFile(@Param("id") id: string) {
    return await this.service.getFile(id);
  }

  @Post()
  @ApiOperation({ summary: "Upload file" })
  async uploadFile() {
    return await this.service.uploadFile();
  }
}
