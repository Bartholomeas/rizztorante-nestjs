import { Logger } from "@nestjs/common";
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { from, map } from "rxjs";
import { Server, Socket } from "socket.io";

@WebSocketGateway(8001, {
  // namespace: "orders",
  httpCompression: true,
  // cors: {
  //   origin: "*",
  // },
})
export class OrdersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(OrdersGateway.name);
  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log("Initialized");
  }

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;

    this.logger.log("Client connected", client?.id);
    this.logger.log("Total clients", sockets.size);
  }

  handleDisconnect(client: Socket) {
    this.logger.log("Client disconnected", client?.id);
  }

  @SubscribeMessage("subscribeToOrders")
  async handleSubscribeToOrders(client: Socket, @MessageBody() data: any) {
    this.logger.debug("Data::", client?.id, { data });
    // client.join(`orders`);

    // this.io.emit("orderReply", {
    //   id: "test",
    //   status: "NEW",
    //   timestamp: new Date(),
    // });
    // this.io.emit("orderReply", {
    //   id: "test",
    //   status: "NEW",
    //   timestamp: new Date(),
    // });

    return from([1, 2, 3]).pipe(map((item) => ({ event: "orderReply", data: item })));
  }

  async emitOrderUpdate(orderId: string, order: any) {
    this.io.to(`orders`).emit("orderUpdate", order);
  }
}
