import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  Session,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";

import { UserRole } from "@common/types/user-roles.types";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { SessionContent } from "@/auth/sessions/types/session.types";
import { UpdateOrderStatusDto } from "@/orders/dto/update-order-status.dto";
import { UpdateOrderStatusCommand } from "@/orders/queries/impl/update-order-status.command";

import { OrdersService } from "./orders.service";

@Controller("orders")
@ApiTags("Orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(":id")
  async getSingleOrder(
    @Param("id", new ParseUUIDPipe()) orderId: string,
    @Session() session: SessionContent,
  ) {
    return this.ordersService.getSingleOrder(
      orderId,
      session?.passport?.user?.id,
      session?.passport?.user?.role,
    );
  }

  @Get()
  async getUserOrders() {
    return this.ordersService.getAllOrders();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
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
