import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { PageOptionsDto } from "@common/dto/pagination/page-options.dto";
import { SortOrder } from "@common/types/sort-order.type";
import { UserRole } from "@common/types/user-roles.type";

import { Opinion } from "./entities/opinion.entity";
import { OpinionsService } from "./opinions.service";

import type { ApproveOpinionDto } from "./dto/approve-opinion.dto";
import type { CreateOpinionDto } from "./dto/create-opinion.dto";
import type { Repository } from "typeorm";

describe("OpinionsService", () => {
  let service: OpinionsService;
  let mockRepository: Partial<Repository<Opinion>>;

  const mockOpinion = { id: "1", name: "John Doe", rate: 5, createdAt: new Date() };
  const mockOpinions = [mockOpinion];

  beforeEach(async () => {
    const queryBuilder = {
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([mockOpinions, 1]),
    };

    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      create: jest.fn().mockReturnValue(mockOpinion),
      save: jest.fn().mockReturnValue(mockOpinion),
      update: jest.fn().mockReturnValue(mockOpinion),
      findOneBy: jest.fn().mockReturnValue(mockOpinion),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpinionsService,
        {
          provide: getRepositoryToken(Opinion),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OpinionsService>(OpinionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllOpinions", () => {
    const pageOptionsDto = new PageOptionsDto({
      order: SortOrder.ASC,
      page: 1,
      take: 10,
    });

    it("should return all approved opinions", async () => {
      const result = await service.getAllOpinions(pageOptionsDto, UserRole.GUEST);

      expect(result).toBeDefined();
      expect(result.data).toEqual(mockOpinions);
      expect(result.meta.totalItems).toBe(1);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("opinion");
      expect(mockRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        "opinion.isApproved = :isApproved",
        { isApproved: true },
      );
      expect(mockRepository.createQueryBuilder().orderBy).toHaveBeenCalledWith(
        "opinion.createdAt",
        pageOptionsDto.order,
      );
      expect(mockRepository.createQueryBuilder().skip).toHaveBeenCalledWith(
        (pageOptionsDto.page - 1) * pageOptionsDto.take,
      );
      expect(mockRepository.createQueryBuilder().take).toHaveBeenCalledWith(pageOptionsDto.take);
    });
  });
  describe("addOpinion", () => {
    it("should create and save a new opinion", async () => {
      const createOpinionDto: CreateOpinionDto = {
        name: "John Doe",
        rate: 5,
        comment: "Great service!",
      };

      const result = await service.addOpinion(createOpinionDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createOpinionDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockOpinion);
      expect(result).toEqual(mockOpinion);
    });
  });
  describe("approveOpinion", () => {
    it("should update and return the approved opinion", async () => {
      const id = "1";
      const approveOpinionDto: ApproveOpinionDto = { isApproved: true };

      const result = await service.approveOpinion(id, approveOpinionDto);

      expect(mockRepository.update).toHaveBeenCalledWith(id, { isApproved: true });
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(mockOpinion);
    });
  });
});
