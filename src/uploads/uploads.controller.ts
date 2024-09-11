import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  InternalServerErrorException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { UploadsService } from "./uploads.service";

@Controller("uploads")
@ApiTags("Uploads")
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get file" })
  async getFile(@Param("id") id: string) {
    try {
      return await this.service.getFile(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException(err?.message);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "File upload",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message: "File is too large. Max file size is 5MB",
          }),
          new FileTypeValidator({ fileType: /jpeg|jpg|png|webp/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      return await this.service.uploadFile(file);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException(err?.message);
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete file" })
  async deleteFile(@Param("id") id: string) {
    try {
      return await this.service.deleteFile(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException(err?.message);
    }
  }
}
