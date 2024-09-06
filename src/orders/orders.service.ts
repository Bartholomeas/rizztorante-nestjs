import { Injectable, NotImplementedException } from "@nestjs/common";

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

  async addOrder() {
    throw new NotImplementedException();
  }
}
