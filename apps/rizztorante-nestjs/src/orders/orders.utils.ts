import * as crypto from "node:crypto";

export class OrdersUtils {
  static createOrderId(data: string = `${Date.now() * Math.random()}`) {
    return crypto
      .createHash("shake256", {
        outputLength: 3,
      })
      .update(data)
      .digest("hex");
  }
}
