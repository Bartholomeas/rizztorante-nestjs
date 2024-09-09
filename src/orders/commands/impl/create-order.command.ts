import type { User } from "@/auth/entities/user.entity";
import type { Cart } from "@/cart/entities/cart.entity";
import type { CheckoutDto } from "@/checkout/dto/checkout.dto";

export class CreateOrderCommand {
  constructor(public readonly command: { cart: Cart; user: User; checkoutData: CheckoutDto }) {}
}
