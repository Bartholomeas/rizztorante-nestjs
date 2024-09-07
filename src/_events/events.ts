export enum GuestEventTypes {
  CREATED = "guest.created",
  SESSION_CREATED = "guest.session.created",
}

export enum CartEventTypes {
  PROCEED_CHECKOUT = "cart.proceed-checkout",
}

export enum MenuPublicEventTypes {
  GET_SINGLE_POSITION = "menu-public.get-single-position",
}

export enum CheckoutEventTypes {
  GET_USER_CART = "checkout.get-user-cart",
  INIT_PAYMENT = "checkout.init-payment",
  CREATE_ORDER = "checkout.create-order",
}
