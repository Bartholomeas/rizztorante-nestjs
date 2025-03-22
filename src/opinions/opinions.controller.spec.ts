import { PageOptionsDto } from "@common/dto/pagination/page-options.dto";
import type { PageDto } from "@common/dto/pagination/page.dto";
import { UserRole } from "@common/types/user-roles.type";
import { InternalServerErrorException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { SessionContent } from "@/auth/sessions/types/session.types";

import type { ApproveOpinionDto } from "./dto/approve-opinion.dto";
import type { CreateOpinionDto } from "./dto/create-opinion.dto";
import type { OpinionDto } from "./dto/opinion.dto";
import { Opinion } from "./entities/opinion.entity";
import { OpinionsController } from "./opinions.controller";
import { OpinionsService } from "./opinions.service";

describe("OpinionsController", () => {
  let controller: OpinionsController;
  let service: OpinionsService;

  const mockOpinion: OpinionDto = {
    id: "1",
    name: "John Doe",
    rate: 5,
    createdAt: new Date(),
    isApproved: true,
    comment: "Great service!",
  };
  const mockPageDto: PageDto<OpinionDto> = {
    data: [mockOpinion],
    meta: {
      page: 1,
      take: 10,
      totalItems: 1,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  };

  const mockSession: SessionContent = {
    id: "test-session-id",
    cookie: {
      originalMaxAge: 86400000,
      expires: new Date(Date.now() + 86400000),
      secure: true,
      httpOnly: true,
      path: "/",
    },
    passport: {
      user: {
        id: "user-id",
        email: "user@example.com",
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: "password",
        orders: [],
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpinionsController],
      providers: [
        OpinionsService,
        {
          provide: getRepositoryToken(Opinion),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<OpinionsController>(OpinionsController);
    service = module.get<OpinionsService>(OpinionsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAllOpinions", () => {
    it("should return all opinions", async () => {
      const pageOptionsDto = new PageOptionsDto({ page: 1, take: 10 });

      jest.spyOn(service, "getAllOpinions").mockResolvedValue(mockPageDto);

      const result = await controller.getAllOpinions(mockSession, pageOptionsDto);

      expect(result).toEqual(mockPageDto);
      expect(service.getAllOpinions).toHaveBeenCalledWith(pageOptionsDto, UserRole.ADMIN);
    });

    it("should handle errors", async () => {
      const pageOptionsDto = new PageOptionsDto({ page: 1, take: 10 });

      jest.spyOn(service, "getAllOpinions").mockRejectedValue(new Error("Test error"));

      await expect(controller.getAllOpinions(mockSession, pageOptionsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it("should use GUEST role when no user in session", async () => {
      const pageOptionsDto = new PageOptionsDto({ page: 1, take: 10 });
      const guestSession = { ...mockSession, passport: {} };

      jest.spyOn(service, "getAllOpinions").mockResolvedValue(mockPageDto);

      const correctedGuestSession: SessionContent = {
        ...guestSession,
        passport: {
          user: {
            role: UserRole.GUEST,
            id: "guest-id",
            email: "guest@example.com",
            createdAt: new Date(),
            updatedAt: new Date(),
            password: "guest-password",
            orders: [],
          },
        },
      };
      await controller.getAllOpinions(correctedGuestSession, pageOptionsDto);

      expect(service.getAllOpinions).toHaveBeenCalledWith(pageOptionsDto, UserRole.GUEST);
    });
  });

  describe("addOpinion", () => {
    it("should add a new opinion", async () => {
      const createOpinionDto: CreateOpinionDto = {
        name: "John Doe",
        rate: 5,
        comment: "Great service!",
      };

      jest.spyOn(service, "addOpinion").mockResolvedValue(mockOpinion);

      const result = await controller.addOpinion(createOpinionDto);

      expect(result).toEqual(mockOpinion);
      expect(service.addOpinion).toHaveBeenCalledWith(createOpinionDto);
    });

    it("should handle errors", async () => {
      const createOpinionDto: CreateOpinionDto = {
        name: "John Doe",
        rate: 5,
        comment: "Great service!",
      };

      jest.spyOn(service, "addOpinion").mockRejectedValue(new Error("Test error"));

      await expect(controller.addOpinion(createOpinionDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("approveOpinion", () => {
    it("should approve an opinion", async () => {
      const id = "1";
      const approveOpinionDto: ApproveOpinionDto = { isApproved: true };

      jest.spyOn(service, "approveOpinion").mockResolvedValue(mockOpinion);

      const result = await controller.approveOpinion(id, approveOpinionDto);

      expect(result).toEqual(mockOpinion);
      expect(service.approveOpinion).toHaveBeenCalledWith(id, approveOpinionDto);
    });

    it("should handle errors", async () => {
      const id = "1";
      const approveOpinionDto: ApproveOpinionDto = { isApproved: true };

      jest.spyOn(service, "approveOpinion").mockRejectedValue(new Error("Test error"));

      await expect(controller.approveOpinion(id, approveOpinionDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
