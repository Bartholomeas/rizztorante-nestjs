import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { UserRole } from "@/types/user-roles";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: UserRole[], userRole: UserRole) {
    return roles.includes(userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>("roles", context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();

    if (!request?.user) return false;
    return this.matchRoles(roles, request?.user?.role);
  }
}
