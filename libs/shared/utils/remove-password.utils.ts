import type { Employee } from "@app/admin/employees/entities/employee.entity";

import type { CreateUserDto } from "@app/restaurant/auth/dto/create-user.dto";
import type { User } from "@app/restaurant/users/entities/user.entity";

export class RemovePasswordUtils {
  static removePasswordFromResponse<T extends User | CreateUserDto | Employee>(
    user: T,
  ): Omit<T, "password" | "confirmPassword"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, confirmPassword, ...restOfUser } = user as T & {
      password?: string;
      confirmPassword?: string;
    };

    return restOfUser;
  }
}
