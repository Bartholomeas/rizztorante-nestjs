import { SetMetadata } from "@nestjs/common";

import type { UserRole } from "@/common/types/user-roles.types";

export const Roles = (...args: (keyof typeof UserRole)[]) => SetMetadata("roles", args);
