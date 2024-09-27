import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { RemovePasswordUtils } from "@common/utils/remove-password.utils";

import { User } from "@/users/entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async getCurrentUser(userId: string | undefined): Promise<Omit<User, "password">> {
    if (!userId) throw new NotFoundException("User ID is required");
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    return RemovePasswordUtils.removePasswordFromResponse(user);
  }
}
