import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CheckoutEventTypes } from "@events/events";
import { CheckoutPaymentEvent } from "@events/payloads";

import { Cart } from "@/cart/entities/cart.entity";

import { CheckoutDto } from "./dto/checkout.dto";
import { PaymentsEnum, PickupEnum } from "./enums/checkout.enums";

@Injectable()
export class CheckoutService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  async proceedCheckout(userId: string | undefined, checkoutDto: CheckoutDto) {
    if (!userId) throw new NotFoundException("User is not found");

    const [userCart] = (await this.eventEmitter.emitAsync(
      CheckoutEventTypes.GET_USER_CART,
      userId,
    )) as [Cart];

    if (checkoutDto.paymentType === PaymentsEnum.ONLINE) {
      const checkoutPayload: CheckoutPaymentEvent = {
        type: CheckoutEventTypes.INIT_PAYMENT,
        payload: {
          cart: userCart,
          userCheckoutData: checkoutDto,
        },
      };

      const [successUrl] = await this.eventEmitter.emitAsync(
        checkoutPayload.type,
        checkoutPayload.payload,
      );
      return successUrl;
    }

    return userCart;
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
