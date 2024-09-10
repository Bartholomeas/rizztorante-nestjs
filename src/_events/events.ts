// To separate in the future for auth and user modules
export enum UserEventTypes {
  GUEST_CREATED = "user.guest-created",
  SESSION_CREATED = "user.session-created",
  GET_USER_PROFILE = "user.get-user",
}

export enum CartEventTypes {
  GET_USER_CART = "cart.get-user-cart",
  PROCEED_CHECKOUT = "cart.proceed-checkout",
}

export enum MenuPublicEventTypes {
  GET_SINGLE_POSITION = "menu.get-single-position",
}

export enum PaymentsEventTypes {
  INIT_PAYMENT = "payments.init",
}

export enum OrderEventTypes {
  CREATE_ORDER = "orders.create-order",
}
