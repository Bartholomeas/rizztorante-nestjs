import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class CheckoutService {
  constructor() {}
  async proceedCheckout() {
    throw new NotImplementedException();
  }
  async setDelivery() {
    throw new NotImplementedException();
  }
  async setPayment() {
    throw new NotImplementedException();
  }
}
