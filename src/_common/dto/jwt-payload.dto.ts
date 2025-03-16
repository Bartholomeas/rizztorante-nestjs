import type { UserRole } from "@common/types/user-roles.type";

export interface JwtPayloadDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  role: UserRole;
}
