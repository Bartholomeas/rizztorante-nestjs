import { SetMetadata } from "@nestjs/common";

import type { UserRole } from "@/_common/types/user-roles.types";

export const Roles = (...args: (keyof typeof UserRole)[]) => SetMetadata("roles", args);
