import type { User } from "@/users/entities/user.entity";

export interface AuthJwtUserDto {
  accessToken: string;
  user: Omit<User, "password">;
}
