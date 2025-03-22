import { Currency } from "@common/types/currency.type";
import { InjectQueue } from "@nestjs/bullmq";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Queue } from "bullmq";
import * as dayjs from "dayjs";

import { CartDto } from "@/cart/dto/cart.dto";
import { CART_REPOSITORY_DI, CartRepository } from "@/cart/repositories/cart.repository";
import { PaymentDetailsDto } from "@/orders/dto/payment-details.dto";
import { ORDER_QUEUE, ORDER_QUEUE_EVENTS } from "@/orders/orders.constants";
import { OrderStatus } from "@/orders/types/order-status.enum";
import { PaymentsService } from "@/payments/payments.service";
import { USER_REPOSITORY_DI, UserRepository } from "@/users/repositories/user.repository";

import { CheckoutDto } from "./dto/checkout.dto";
import { PaymentsEnum, PickupEnum } from "./enums/checkout.enums";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(ORDER_QUEUE) private readonly ordersQueue: Queue,
    @Inject(USER_REPOSITORY_DI) private readonly userRepository: UserRepository,
    @Inject(CART_REPOSITORY_DI) private readonly cartRepository: CartRepository,
    private readonly paymentsService: PaymentsService,
  ) {}

  async proceedCheckout(userId: string | undefined, checkoutDto: CheckoutDto) {
    if (!userId) throw new NotFoundException("User is not found");

    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart?.items?.length) throw new BadRequestException("Cart is empty");

    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new NotFoundException("User is not found");

    // Generate ONLY ONE order ID to use everywhere
    const orderId = crypto.randomUUID();
    const cartDto = new CartDto(cart);

    const orderStatus =
      checkoutDto?.paymentType === PaymentsEnum.ONLINE ? OrderStatus.NEW : OrderStatus.PENDING;

    await this.ordersQueue.add(ORDER_QUEUE_EVENTS.CREATE_ORDER, {
      orderId,
      cart: cartDto,
      user,
      checkoutData: checkoutDto,
      status: orderStatus,
    });

    if (checkoutDto.paymentType === PaymentsEnum.ONLINE) {
      const { url, session } = await this.paymentsService.createPayment({
        orderId,
        lineItems: cartDto.toStripeLineItems(),
        checkoutData: checkoutDto,
      });

      const paymentDetails = new PaymentDetailsDto({
        cancelUrl: session?.cancel_url,
        currency: session?.currency as Currency,
        expiresAt: dayjs(session?.expires_at).toDate(),
        discounts: [],
        method: session?.payment_method_types[0],
        paidAmount: session?.amount_total,
        paymentUrl: session?.url,
      });

      await this.ordersQueue.add(ORDER_QUEUE_EVENTS.UPDATE_ORDER_PAYMENT_DETAILS, {
        orderId,
        paymentDetails,
      });

      return { url, session };
    } else {
      return { message: "Thanks for ordering!" };
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
