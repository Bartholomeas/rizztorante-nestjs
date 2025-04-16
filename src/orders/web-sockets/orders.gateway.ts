import { SocketWithAuth } from "@common/types/jwt.types";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { Logger, UseInterceptors } from "@nestjs/common";
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { OrdersService } from "../services/orders.service";

import { ORDERS_SOCKET_EVENTS } from "./orders-socket.events";

@WebSocketGateway(8001, {
  namespace: "orders",
  httpCompression: true,
  transports: ["websocket"],
  cors: {
    origin: "*",
  },
})
export class OrdersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(OrdersGateway.name);
  @WebSocketServer() io: Server;

  constructor(private readonly ordersService: OrdersService) {}

  async afterInit() {
    const orders = await this.ordersService.findAll();
    this.logger.log("Initialized orders::", orders?.length);
  }

  handleConnection(client: SocketWithAuth) {
    this.logger.debug("CLIENT:  ", client?.role, client?.userId);
  }

  handleDisconnect(client: Socket) {
    this.logger.log("Client disconnected", client?.id);
  }

  @SubscribeMessage("join_room")
  handleJoinRoom(client: Socket) {
    client.join(ORDERS_SOCKET_EVENTS.GET_ALL_ORDERS);
  }

  @SubscribeMessage(ORDERS_SOCKET_EVENTS.LEAVE_ROOM)
  handleLeaveRoom(client: Socket) {
    client.leave(ORDERS_SOCKET_EVENTS.GET_ALL_ORDERS);
  }

  @CacheKey("orders")
  @UseInterceptors(CacheInterceptor)
  @SubscribeMessage(ORDERS_SOCKET_EVENTS.GET_ALL_ORDERS)
  async handleSubscribeToOrders(client: Socket, @MessageBody() data: any) {
    this.logger.debug("Client subscribing to orders: ", client?.id, { data });

    const orders = await this.ordersService.findAll();

    return { event: ORDERS_SOCKET_EVENTS.GET_ALL_ORDERS, data: orders };
  }

  @SubscribeMessage(ORDERS_SOCKET_EVENTS.ORDER_CREATED)
  async handleAddOrder() {
    const orders = await this.ordersService.findAll();

    return { event: ORDERS_SOCKET_EVENTS.ORDER_CREATED, data: orders };
  }

  async emitOrderUpdate(orderId: string, order: any) {
    this.logger.debug("emiting order update: ", orderId);
    this.io.to(`orders`).emit(ORDERS_SOCKET_EVENTS.ORDER_UPDATED, order);
  }
}
