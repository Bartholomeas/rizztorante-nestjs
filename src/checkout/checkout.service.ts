import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { getUserCartEvent, initPaymentEvent } from "@events/payloads";
import { createOrderEvent } from "@events/payloads/orders";

import { CartDto } from "@/cart/dto/cart.dto";
import { User } from "@/users/entities/user.entity";

import { CheckoutDto } from "./dto/checkout.dto";
import { PaymentsEnum, PickupEnum } from "./enums/checkout.enums";
import { USER_REPOSITORY_DI, UserRepository } from "@/users/repositories/user.repository";

interface CreateOrderProps {
  cart: CartDto;
  user: User;
  checkoutData: CheckoutDto;
}

@Injectable()
export class CheckoutService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(USER_REPOSITORY_DI) private readonly userRepository: UserRepository,
  ) {}

  async proceedCheckout(userId: string | undefined, checkoutDto: CheckoutDto) {
    if (!userId) throw new NotFoundException("User is not found");
    const [cart] = (await this.eventEmitter.emitAsync(...getUserCartEvent(userId))) as [CartDto];

    // 1. Get user cart
    // 2. Get user
    // 3. Create order with PENDING status
    // 4. Try make PAYMENT for order (if its online)
    // 5. Notify restaurant about new order

    if (!cart?.items?.length) throw new BadRequestException("Cart is empty");

    // const [user] = await this.eventEmitter.emitAsync(...getUserEvent(userId));

    const user = await this.userRepository.findUserById(userId);

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
