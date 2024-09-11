import { ConfigService } from "@nestjs/config";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { UploadsService } from "./uploads.service";

describe("UploadsService", () => {
  let service: UploadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              switch (key) {
                case "S3_BUCKET_NAME":
                  return "test-bucket";
                case "S3_REGION":
                  return "test-region";
                case "S3_ACCESS_KEY":
                  return "access-key";
                case "S3_SECRET_ACCESS_KEY":
                  return "secret-access-key";

                default:
                  throw new Error(`Unexpected config key: ${key}`);
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
