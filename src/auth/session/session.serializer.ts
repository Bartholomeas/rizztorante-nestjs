import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser<T extends { cart: any[] }>(user: T, done: (err: Error, user: T) => void) {
    user.cart = ["XDD"];
    done(null, user);
  }
  deserializeUser<T>(payload: T, done: (err: Error, payload: T) => void) {
    done(null, payload);
  }
}
