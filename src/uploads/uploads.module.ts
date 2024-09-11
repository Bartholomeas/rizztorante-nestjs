import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";

import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 8000,
        limit: 5,
      },
    ]),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
