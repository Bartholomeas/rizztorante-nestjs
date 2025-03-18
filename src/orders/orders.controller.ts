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
import { ApiTags } from "@nestjs/swagger";

import { UserRole } from "@common/types/user-roles.type";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { UpdateOrderStatusDto } from "@/orders/dto/update-order-status.dto";

import { OrdersService } from "./services/orders.service";

import { JwtUser } from "@common/decorators/jwt-user.decorator";
import { JwtPayloadDto } from "@common/dto/jwt-payload.dto";

@Controller("orders")
@ApiTags("Orders")
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get(":id")
  async getSingleOrder(
    @Param("id", new ParseUUIDPipe()) orderId: string,
    @JwtUser() user: JwtPayloadDto,
  ) {
    return this.service.getSingleOrder(orderId, user?.id, user?.role);
  }

  @Get()
  async getUserOrders(@JwtUser() user: JwtPayloadDto) {
    return this.service.getAllOrders(user.id, user.role);
  }

  // @IsPublic()
  // @Post()
  // async createOrder(@Body() payload: OrdersCreateOrderPayload) {
  //   return await this.createOrdersService.createOrder(payload);
  // }

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
