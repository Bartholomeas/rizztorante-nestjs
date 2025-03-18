import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";

import { ORDER_QUEUE } from "./orders.constants";

@Processor(ORDER_QUEUE)
export class OrdersProcessor extends WorkerHost {
  private readonly logger = new Logger(OrdersProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log("Process:", job.name, job.id);
  }
}
