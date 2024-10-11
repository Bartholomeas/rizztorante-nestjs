import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CartDto } from "@app/restaurant/cart/dto/cart.dto";
import { User } from "@app/restaurant/users/entities/user.entity";

import { getUserCartEvent, initPaymentEvent } from "@events/payloads";
import { getUserEvent } from "@events/payloads/auth";
import { createOrderEvent } from "@events/payloads/orders";

import { CheckoutDto } from "./dto/checkout.dto";
import { PaymentsEnum, PickupEnum } from "./enums/checkout.enums";

interface CreateOrderProps {
  cart: CartDto;
  user: User;
  checkoutData: CheckoutDto;
}

@Injectable()
export class CheckoutService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async proceedCheckout(userId: string | undefined, checkoutDto: CheckoutDto) {
    try {
      if (!userId) throw new NotFoundException("User is not found");
      const [cart] = (await this.eventEmitter.emitAsync(...getUserCartEvent(userId))) as [CartDto];

      // 1. Get user cart
      // 2. Get user
      // 3. Create order with PENDING status
      // 4. Try make PAYMENT for order (if its online)
      // 5. Notify restaurant about new order

      if (!cart?.items?.length) throw new BadRequestException("Cart is empty");

      const [user] = await this.eventEmitter.emitAsync(...getUserEvent(userId));

      if (checkoutDto.paymentType === PaymentsEnum.ONLINE) {
        return await this.createOnlineOrder({
          cart,
          user,
          checkoutData: checkoutDto,
        });
      } else {
        return await this.createInPersonOrder({
          cart,
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
    const [successUrl] = await this.eventEmitter.emitAsync(
      ...initPaymentEvent({
        lineItems: cart.toStripeLineItems(),
        checkoutData,
      }),
    );

    await this.eventEmitter.emitAsync(
      ...createOrderEvent({
        cartDto: cart,
        user,
        checkoutData,
      }),
    );

    return successUrl;
  }

  private async createInPersonOrder({
    cart,
    user,
    checkoutData,
  }: CreateOrderProps): Promise<{ url: string }> {
    await this.eventEmitter.emitAsync(
      ...createOrderEvent({
        cartDto: cart,
        user,
        checkoutData,
      }),
    );

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
