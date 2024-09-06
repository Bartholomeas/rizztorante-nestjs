import type { CheckoutEventTypes } from "@events/events";
import type { EventBody } from "@events/events.types";

// export class CheckoutGetUserCartPayload {
//   @IsUUID()
//   public readonly userId: string;
//   constructor(userId: string) {
//     this.userId = userId;
//   }
// }

export type CheckoutGetUserCartEvent = EventBody<typeof CheckoutEventTypes.GET_USER_CART, string>;
