import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";

import { UserRole } from "@common/types/user-roles.types";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";

import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";
import { UpdateOrderStatusCommand } from "./queries/impl/update-order-status.command";

@Controller("orders")
@ApiTags("Orders")
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
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

  // @Get(":id/delete")
  // async deleteOrder(@Param("id", new ParseUUIDPipe()) orderId: string) {
  //   console.log(orderId);
  //   return this.ordersService.deleteOrder();
  // }

  @Put(":id/status")
  async updateOrderStatus(
    @Param("id", new ParseUUIDPipe()) orderId: string,
    @Body(ValidationPipe) { status }: UpdateOrderStatusDto,
  ) {
    try {
      return await this.commandBus.execute(new UpdateOrderStatusCommand(orderId, status));
    } catch (err) {
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException();
    }
  }
}
