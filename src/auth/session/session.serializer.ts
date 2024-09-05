import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser<T extends { cart: any[] }>(user: T, done: (err: Error, user: T) => void) {
    return done(null, user);
  }

  deserializeUser<T>(payload: T, done: (err: Error, payload: T) => void) {
    return done(null, payload);
  }
}
