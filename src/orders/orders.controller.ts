import { Controller, Post, Get, Param, Body, ValidationPipe, ParseUUIDPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { OrdersService } from "./orders.service";

@Controller("orders")
@ApiTags("Orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async addOrder(@Body(ValidationPipe) orderData: any) {
    console.log(orderData);
    return this.ordersService.addOrder();
  }

  @Get(":id")
  async getOrder(@Param("id", new ParseUUIDPipe()) orderId: string) {
    console.log(orderId);
    return this.ordersService.getOrder();
  }

  @Get()
  async getAllOrders() {
    return this.ordersService.getAllOrders(); // Mocked implementation
  }

  @Post(":id")
  async updateOrder(
    @Param("id", new ParseUUIDPipe()) orderId: string,
    @Body(ValidationPipe) orderData: any,
  ) {
    console.log(orderId, orderData);
    return this.ordersService.updateOrder();
  }

  @Get(":id/delete")
  async deleteOrder(@Param("id", new ParseUUIDPipe()) orderId: string) {
    console.log(orderId);
    return this.ordersService.deleteOrder();
  }
}
