import { SocketWithAuth } from "@common/types/jwt.types";
import { INestApplicationContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get<string>("CLIENT_PORT") ?? "3000");

    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9][1-9]\d):${clientPort}$/`),
      ],
      methods: ["GET", "POST"],
    };

    this.logger.log("Configuring SocketIO server with custom CORS options: ", { no: "no" });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);

    const server: Server = super.createIOServer(port, optionsWithCORS);
    server.of("orders").use(createTokenMiddleware(jwtService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) => (socket: SocketWithAuth, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers["token"];

    logger.debug(`Validating token: ${token}`);

    try {
      const payload = jwtService.verify(token, { ignoreExpiration: true });
      socket.userId = payload.id;
      socket.roomId = payload.roomId;
      socket.role = payload.role;

      logger.log("User socket payload: ", { payload });

      next();
    } catch (error) {
      logger.error("Websocket middleware error: ", error?.message);
      next(new Error("FORBIDDEN"));
    }
  };
