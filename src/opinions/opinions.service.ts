import { PageMetadataDto } from "@common/dto/pagination/page-metadata.dto";
import { PageOptionsDto } from "@common/dto/pagination/page-options.dto";
import { PageDto } from "@common/dto/pagination/page.dto";
import { UserRole } from "@common/types/user-roles.type";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApproveOpinionDto } from "./dto/approve-opinion.dto";
import { CreateOpinionDto } from "./dto/create-opinion.dto";
import { OpinionDto } from "./dto/opinion.dto";
import { Opinion } from "./entities/opinion.entity";

@Injectable()
export class OpinionsService {
  constructor(@InjectRepository(Opinion) private readonly repository: Repository<Opinion>) {}

  async getAllOpinions(
    pageOptionsDto: PageOptionsDto,
    userRole: UserRole,
  ): Promise<PageDto<Opinion>> {
    const queryBuilder = this.repository.createQueryBuilder("opinion");

    if (userRole === UserRole.GUEST) {
      queryBuilder.andWhere("opinion.isApproved = :isApproved", { isApproved: true });
    }

    queryBuilder
      .orderBy("opinion.createdAt", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .select(["opinion.id", "opinion.name", "opinion.rate", "opinion.createdAt"]);

    const [entities, totalItems] = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetadataDto({ pageOptionsDto, totalItems });

    return new PageDto(entities, pageMetaDto);
  }

  async addOpinion(dto: CreateOpinionDto) {
    const newOpinion = await this.repository.create(dto);
    return await this.repository.save(newOpinion);
  }

  async approveOpinion(id: string, { isApproved }: ApproveOpinionDto): Promise<OpinionDto> {
    await this.repository.update(id, { isApproved });
    return await this.repository.findOneBy({ id });
  }
}
