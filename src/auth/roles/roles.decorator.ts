import { SetMetadata } from "@nestjs/common";

import type { UserRole } from "@/types/user-roles";

export const Roles = (...args: (keyof typeof UserRole)[]) => SetMetadata("roles", args);
