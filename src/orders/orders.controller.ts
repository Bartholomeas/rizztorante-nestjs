import { Body, Controller, Get, Param, ParseUUIDPipe, Put, ValidationPipe } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";

import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";
import { UpdateOrderStatusCommand } from "./queries/impl/update-order-status.command";

@Controller("orders")
@ApiTags("Orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(":id")
  async getOrder(@Param("id", new ParseUUIDPipe()) orderId: string) {
    console.log(orderId);
    return this.ordersService.getOrder();
  }

  @Get()
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(":id/delete")
  async deleteOrder(@Param("id", new ParseUUIDPipe()) orderId: string) {
    console.log(orderId);
    return this.ordersService.deleteOrder();
  }

  @Put(":id/status")
  async updateOrderStatus(
    @Param("id", new ParseUUIDPipe()) orderId: string,
    @Body(ValidationPipe) { status }: UpdateOrderStatusDto,
  ) {
    return this.commandBus.execute(new UpdateOrderStatusCommand(orderId, status));
  }
}
