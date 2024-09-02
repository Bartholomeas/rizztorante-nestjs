import type { CreateUserDto } from "./dto/create-user.dto";
import type { User } from "./entity/user.entity";

export class AuthUtils {
  static removePasswordFromResponse<T extends User | CreateUserDto>(
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
