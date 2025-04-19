import { Socket } from "socket.io";

import type { UserRole } from "./user-roles.type";

export interface JwtUserDto {
  email: string;
  id: string;
  role: UserRole;
}

interface AuthPayload {
  userId: string;
  roomId: string;
  role: UserRole;
}

export type SocketWithAuth = Socket & AuthPayload;
