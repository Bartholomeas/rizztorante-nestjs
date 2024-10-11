import { Module } from "@nestjs/common";

import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";
import { ImageOptimizer } from "./utils/image-optimizer";

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, ImageOptimizer],
})
export class UploadsModule {}
