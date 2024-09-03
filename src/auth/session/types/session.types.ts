import type { SessionData } from "express-session";

export interface SessionContent extends SessionData {
  id: string;
  passport: {
    user: {
      [key: string]: any;
    };
  };
}
