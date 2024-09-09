import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CheckoutEventTypes } from "@events/events";
import {
  CheckoutCreateOrderEvent,
  CheckoutGetUserEvent,
  CheckoutPaymentEvent,
} from "@events/payloads";

import { Cart } from "@/cart/entities/cart.entity";

import { CheckoutDto } from "./dto/checkout.dto";
import { PaymentsEnum, PickupEnum } from "./enums/checkout.enums";

@Injectable()
export class CheckoutService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async proceedCheckout(userId: string | undefined, checkoutDto: CheckoutDto) {
    try {
      if (!userId) throw new NotFoundException("User is not found");

      const [userCart] = (await this.eventEmitter.emitAsync(
        CheckoutEventTypes.GET_USER_CART,
        userId,
      )) as [Cart];

      const getUserEvent: CheckoutGetUserEvent = {
        type: CheckoutEventTypes.GET_USER_PROFILE,
        payload: userId,
      };
      const [user] = await this.eventEmitter.emitAsync(getUserEvent.type, getUserEvent.payload);

      console.log("HEHEHE", user);

      if (checkoutDto.paymentType === PaymentsEnum.ONLINE) {
        const checkoutEvent: CheckoutPaymentEvent = {
          type: CheckoutEventTypes.INIT_PAYMENT,
          payload: {
            cart: userCart,
            userCheckoutData: checkoutDto,
          },
        };

        const [successUrl] = await this.eventEmitter.emitAsync(
          checkoutEvent.type,
          checkoutEvent.payload,
        );

        const createOrderEvent: CheckoutCreateOrderEvent = {
          type: CheckoutEventTypes.CREATE_ORDER,
          payload: {
            cart: userCart,
            user,
            checkoutData: checkoutDto,
          },
        };

        await this.eventEmitter.emitAsync(createOrderEvent.type, createOrderEvent.payload);

        return successUrl;
      }

      const createOrderEvent: CheckoutCreateOrderEvent = {
        type: CheckoutEventTypes.CREATE_ORDER,
        payload: {
          cart: userCart,
          user,
          checkoutData: checkoutDto,
        },
      };

      await this.eventEmitter.emitAsync(createOrderEvent.type, createOrderEvent.payload);
      // TODO: Clear cart after successful order

      return { url: process.env.PAYMENT_SUCCESS_URL };
    } catch (err) {
      // TODO: Handle better
      if (err instanceof HttpException) throw new HttpException(err?.message, 400);
    }
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
