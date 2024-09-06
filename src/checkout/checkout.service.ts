import { Injectable, NotImplementedException } from "@nestjs/common";

import { PaymentsEnum, PickupEnum } from "./enums/checkout.enums";

@Injectable()
export class CheckoutService {
  constructor() {}
  async proceedCheckout() {
    throw new NotImplementedException();
  }

  async getPickupOptions() {
    return [
      {
        label: "Na miejscu",
        value: PickupEnum.ON_SITE,
      },
      {
        label: "Dowóz",
        value: PickupEnum.DELIVERY,
      },
    ];
  }
  async getPaymentOptions() {
    return [
      {
        label: "Gotówka",
        value: PaymentsEnum.IN_PERSON,
      },
      {
        label: "Płatność online",
        value: PaymentsEnum.ONLINE,
      },
    ];
  }
}
