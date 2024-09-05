import type { User } from "@/auth/entity/user.entity";

import type { SessionData } from "express-session";

export interface SessionContent extends SessionData {
  id: string;
  passport: {
    user: User & {
      [key: string]: any;
    };
  };
}
