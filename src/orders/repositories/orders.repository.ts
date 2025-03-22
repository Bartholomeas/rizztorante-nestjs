import { Repository } from "typeorm";

import { Order } from "../entities/order.entity";

export const ORDERS_REPOSITORY_DI = Symbol.for("ORDERS_REPOSITORY_DI");

export interface OrdersRepository extends Repository<Order> {}
