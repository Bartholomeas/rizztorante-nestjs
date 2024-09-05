import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Strategy } from "passport-local";

import { AuthService } from "../auth.service";
import { User } from "../entity/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string): Promise<Omit<User, "password">> {
    try {
      const user = await this.authService.authenticateUser({ email, password });
      return user;
    } catch (error) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
