import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class TypeormUserRepository extends Repository<User> implements UserRepository {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.findOne({
      where: { email },
      cache: {
        id: `user-${email}`,
        milliseconds: 1000 * 60 * 5,
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.findOne({
      where: { id },
      cache: {
        id: `user-${id}`,
        milliseconds: 1000 * 60 * 5,
      },
    });
  }
}
