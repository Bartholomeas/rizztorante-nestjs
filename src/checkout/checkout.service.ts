import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CheckoutEventTypes } from "@events/events";
import {
  CheckoutCreateOrderEvent,
  CheckoutGetUserEvent,
  CheckoutPaymentEvent,
} from "@events/payloads";

import { User } from "@/auth/entities/user.entity";
import { Cart } from "@/cart/entities/cart.entity";

import { CheckoutDto } from "./dto/checkout.dto";
import { PaymentsEnum, PickupEnum } from "./enums/checkout.enums";

interface CreateOrderProps {
  cart: Cart;
  user: User;
  checkoutData: CheckoutDto;
}

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

      if (checkoutDto.paymentType === PaymentsEnum.ONLINE) {
        return await this.createOnlineOrder({
          cart: userCart,
          user,
          checkoutData: checkoutDto,
        });
      } else {
        return await this.createInPersonOrder({
          cart: userCart,
          user,
          checkoutData: checkoutDto,
        });
      }
    } catch (err) {
      // TODO: Handle better
      if (err instanceof HttpException) throw new HttpException(err?.message, 400);
    }
  }

  private async createOnlineOrder({
    cart,
    user,
    checkoutData,
  }: CreateOrderProps): Promise<{ url: string }> {
    const checkoutEvent: CheckoutPaymentEvent = {
      type: CheckoutEventTypes.INIT_PAYMENT,
      payload: {
        cart,
        checkoutData,
      },
    };
    const createOrderEvent: CheckoutCreateOrderEvent = {
      type: CheckoutEventTypes.CREATE_ORDER,
      payload: {
        cart,
        user,
        checkoutData,
      },
    };

    const [successUrl] = await this.eventEmitter.emitAsync(
      checkoutEvent.type,
      checkoutEvent.payload,
    );

    await this.eventEmitter.emitAsync(createOrderEvent.type, createOrderEvent.payload);

    return successUrl;
  }

  private async createInPersonOrder({
    cart,
    user,
    checkoutData,
  }: CreateOrderProps): Promise<{ url: string }> {
    const createOrderEvent: CheckoutCreateOrderEvent = {
      type: CheckoutEventTypes.CREATE_ORDER,
      payload: {
        cart,
        user,
        checkoutData,
      },
    };

    await this.eventEmitter.emitAsync(createOrderEvent.type, createOrderEvent.payload);

    return { url: process.env.PAYMENT_SUCCESS_URL };
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
