// To separate in the future for auth and user modules
export enum UserEventTypes {
  GUEST_CREATED = "guest.created",
  SESSION_CREATED = "guest.session.created",
  GET_USER_PROFILE = "user.get-user",
}

export enum CartEventTypes {
  GET_USER_CART = "checkout.get-user-cart",
  PROCEED_CHECKOUT = "cart.proceed-checkout",
}

export enum MenuPublicEventTypes {
  GET_SINGLE_POSITION = "menu-public.get-single-position",
}

export enum CheckoutEventTypes {
  INIT_PAYMENT = "checkout.init-payment",
  CREATE_ORDER = "checkout.create-order",
}
