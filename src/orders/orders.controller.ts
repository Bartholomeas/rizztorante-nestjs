import { JwtUser } from "@common/decorators/jwt-user.decorator";
import { JwtPayloadDto } from "@common/dto/jwt-payload.dto";
import { UserRole } from "@common/types/user-roles.type";
import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { UpdateOrderStatusDto } from "@/orders/dto/update-order-status.dto";

import { FindOrdersRequest } from "./http/requests/find-orders.request";
import { JoinOrdersRoomRequest } from "./http/requests/join-orders-room.request";
import { OrdersService } from "./services/orders.service";

@Controller("orders")
@ApiTags("Orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DELIVERY, UserRole.KITCHEN, UserRole.SERVICE)
  @UseGuards(RolesGuard)
  async findAll(@JwtUser() user: JwtPayloadDto, @Query() request: FindOrdersRequest) {
    return await this.ordersService.findAll({ user, options: request });
  }

  @Get(":id")
  async getSingleOrder(
    @Param("id", new ParseUUIDPipe()) orderId: string,
    @JwtUser() user: JwtPayloadDto,
  ) {
    return await this.ordersService.getSingleOrder(orderId, user?.id, user?.role);
  }

  @Get("/user")
  async getUserOrders(@JwtUser() user: JwtPayloadDto) {
    return await this.ordersService.getAllOrders(user.id, user.role);
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
      return await this.ordersService.updateOrder(orderId, status);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException();
    }
  }

  // Socket routes

  @Post("/join-room")
  @Roles(UserRole.ADMIN, UserRole.DELIVERY, UserRole.KITCHEN, UserRole.SERVICE)
  @UseGuards(RolesGuard)
  async joinRoom(@JwtUser() user: JwtPayloadDto, @Body() request: JoinOrdersRoomRequest) {
    console.log("JONI ROOM: ", { user, request });
  }
}
