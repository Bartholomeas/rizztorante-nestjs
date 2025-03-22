import type { Repository } from "typeorm";

import type { User } from "../entities/user.entity";

export const USER_REPOSITORY_DI = Symbol.for("USER_REPOSITORY_DI");

export interface UserRepository extends Repository<User> {
  findUserByEmail: (email: string) => Promise<User | null>;
  findUserById: (id: string) => Promise<User | null>;
}
