import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

import { Order } from "../entities/order.entity";
import { OrdersRepository } from "../repositories/orders.repository";

@Injectable()
export class TypeormOrdersRepository extends Repository<Order> implements OrdersRepository {
  constructor(dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }
}
