import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser<T = unknown>(user: T, done: (err: Error, user: T) => void) {
    done(null, user);
  }
  deserializeUser<T = unknown>(payload: T, done: (err: Error, payload: T) => void) {
    done(null, payload);
  }
}
