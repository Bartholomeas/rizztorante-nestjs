import type { User } from "@app/restaurant/users/entities/user.entity";
import type { SessionData } from "express-session";

export interface SessionContent extends SessionData {
  id: string;
  passport: {
    user: User & {
      [key: string]: any;
    };
  };
}
