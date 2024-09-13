import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FindManyOptions, Repository } from "typeorm";

import { UserRole } from "@common/types/user-roles.type";

import { CreateOpinionDto } from "./dto/create-opinion.dto";
import { Opinion } from "./entities/opinion.entity";

@Injectable()
export class OpinionsService {
  constructor(@InjectRepository(Opinion) private readonly repository: Repository<Opinion>) {}
  async getAllOpinions(role = UserRole.GUEST) {
    const findOptions: FindManyOptions<Opinion> = {
      order: {
        createdAt: "DESC",
      },
      select: ["id", "createdAt", "name", "rate", "comment"],
    };

    if (role !== UserRole.ADMIN) {
      findOptions.where = { isApproved: true };
    }

    return await this.repository.find(findOptions);
  }
  async addOpinion(dto: CreateOpinionDto) {
    const newOpinion = await this.repository.create(dto);
    return await this.repository.save(newOpinion);
  }
}
