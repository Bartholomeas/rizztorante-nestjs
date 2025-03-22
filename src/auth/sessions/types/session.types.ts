import type { SessionData } from "express-session";

import type { User } from "@/users/entities/user.entity";

export interface SessionContent extends SessionData {
  id: string;
  passport: {
    user: User & {
      [key: string]: any;
    };
  };
}
