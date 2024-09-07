import { Injectable, NotImplementedException } from "@nestjs/common";

import { CheckoutCreateOrderPayload } from "@events/payloads";

@Injectable()
export class OrdersService {
  constructor() {}

  async getOrder() {
    throw new NotImplementedException();
  }
  async getAllOrders() {
    throw new NotImplementedException();
  }

  async changeStatusOrder() {
    throw new NotImplementedException();
  }

  async updateOrder() {
    throw new NotImplementedException();
  }

  async deleteOrder() {
    throw new NotImplementedException();
  }

  async createOrder(payload: CheckoutCreateOrderPayload) {
    console.log("FF create order: ", payload);
    throw new NotImplementedException();
  }
}
