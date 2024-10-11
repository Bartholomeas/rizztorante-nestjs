import { SetMetadata } from "@nestjs/common";

import type { UserRole } from "@app/restaurant/_common/types/user-roles.type";

export const Roles = (...args: (keyof typeof UserRole)[]) => SetMetadata("roles", args);
