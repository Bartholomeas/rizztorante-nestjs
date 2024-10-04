import { join } from "node:path";
import { Worker } from "node:worker_threads";

import { Injectable, InternalServerErrorException } from "@nestjs/common";

type OptimizeImageResponse = Promise<{ buffer: Buffer; contentType: string }>;

@Injectable()
export class ImageOptimizer {
  private readonly workerPath: string;

  constructor() {
    this.workerPath = join(__dirname, "image-optimizer.worker.js");
  }

  async optimizeImage(buffer: Buffer, contentType: string): OptimizeImageResponse {
    if (!contentType.startsWith("image/")) return { buffer, contentType };
    return new Promise((resolve, reject) => {
      const worker = new Worker(this.workerPath, {
        workerData: { buffer, contentType },
      });

      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new InternalServerErrorException(`Worker stopped with exit code ${code}`));
      });
    });
  }
}
