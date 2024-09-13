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
import { ApiTags } from "@nestjs/swagger";

import { UserRole } from "@common/types/user-roles.type";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { SessionContent } from "@/auth/sessions/types/session.types";
import { UpdateOrderStatusDto } from "@/orders/dto/update-order-status.dto";

import { OrdersService } from "./orders.service";

@Controller("orders")
@ApiTags("Orders")
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get(":id")
  async getSingleOrder(
    @Param("id", new ParseUUIDPipe()) orderId: string,
    @Session() session: SessionContent,
  ) {
    return this.service.getSingleOrder(
      orderId,
      session?.passport?.user?.id,
      session?.passport?.user?.role,
    );
  }

  @Get()
  async getUserOrders(@Session() session: SessionContent) {
    return this.service.getAllOrders(session?.passport?.user?.id, session?.passport?.user?.role);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Put(":id/status")
  async updateOrderStatus(
    @Param("id", new ParseUUIDPipe()) orderId: string,
    @Body(ValidationPipe) { status }: UpdateOrderStatusDto,
  ) {
    try {
      return await this.service.updateOrder(orderId, status);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException();
    }
  }
}
