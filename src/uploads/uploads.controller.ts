import { UserRole } from "@common/types/user-roles.type";
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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";

import { UploadsService } from "./uploads.service";

@Throttle({
  default: {
    ttl: 8000,
    limit: 5,
  },
})
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

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload file (admin only)" })
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

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(":id")
  @ApiOperation({ summary: "Delete file (admin only)" })
  async deleteFile(@Param("id") id: string) {
    try {
      return await this.service.deleteFile(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException(err?.message);
    }
  }
}
