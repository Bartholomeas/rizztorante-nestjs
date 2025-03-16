import type { UserRole } from "./user-roles.type";

export interface JwtUserDto {
  email: string;
  id: string;
  role: UserRole;
}
