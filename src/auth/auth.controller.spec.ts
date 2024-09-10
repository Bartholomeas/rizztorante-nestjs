import { InternalServerErrorException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { UserRole } from "@/_common/types/user-roles.types";
import { AuthUtils } from "@/auth/auth.utils";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import type { CreateUserDto } from "./dto/create-user.dto";
import type { LoginUserDto } from "./dto/login-user.dto";

jest.mock("@nestjs/event-emitter", () => ({
  ...jest.requireActual("@nestjs/event-emitter"),
  OnEvent: jest.fn(),
  EventEmitter: jest.fn().mockImplementation(() => ({
    emit: jest.fn(),
    emitAsync: jest.fn(),
  })),
}));
jest.mock("@events/events", () => ({
  GuestEventTypes: {
    CREATED: "mocked_created",
  },
  CheckoutEventTypes: {
    GET_USER_CART: "mocked_get_user_cart",
  },
}));

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerUser: jest.fn(),
            authenticateUser: jest.fn(),
            createOrRetrieveGuestUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "StrongPassword123!",
        confirmPassword: "StrongPassword123!",
      };
      const result = {
        id: 1,
        email: "test@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: UserRole.USER,
      };
      jest.spyOn(authService, "registerUser").mockResolvedValue({
        ...result,
        id: "1", // Change id to string type
        role: UserRole.USER,
        orders: [],
      });

      expect(await authController.register(createUserDto)).toEqual({
        ...result,
        id: "1",
        role: UserRole.USER,
      });
    });

    it("should throw an error if the password is weak", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "weak",
        confirmPassword: "weak",
      };
      jest.spyOn(authService, "registerUser").mockImplementation(() => {
        throw new Error("Password is too weak");
      });

      await expect(authController.register(createUserDto)).rejects.toThrow("Password is too weak");
    });

    it("should throw an error if the email is invalid", async () => {
      const createUserDto: CreateUserDto = {
        email: "invalid-email",
        password: "StrongPassword123!",
        confirmPassword: "StrongPassword123!",
      };
      jest.spyOn(authService, "registerUser").mockImplementation(() => {
        throw new Error("Invalid email format");
      });

      await expect(authController.register(createUserDto)).rejects.toThrow("Invalid email format");
    });

    it("should throw an InternalServerErrorException on error", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "StrongPassword123!",
        confirmPassword: "StrongPassword123!",
      };
      jest.spyOn(authService, "registerUser").mockRejectedValue(new Error("Error"));

      await expect(authController.register(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("loginGuest", () => {
    it("should login as a guest", async () => {
      const session = {
        save: jest.fn(),
        id: "sessionId",
        passport: {
          user: {
            id: "userId",
            createdAt: new Date(),
            updatedAt: new Date(),
            password: null,
            role: UserRole.GUEST,
          },
        },
        cookie: {
          maxAge: 1000,
          originalMaxAge: 1000,
        },
      };
      const guestUser = {
        id: "userId",
        createdAt: new Date(),
        updatedAt: new Date(),
        password: null,
        role: UserRole.GUEST,
      };
      jest.spyOn(authService, "createOrRetrieveGuestUser").mockResolvedValue(guestUser);

      expect(await authController.loginGuest(session)).toEqual(
        AuthUtils.removePasswordFromResponse(guestUser),
      );

      // expect(await authController.loginGuest(sessions)).toEqual(result);
    });
  });

  describe("login", () => {
    it("should login a user", async () => {
      const loginUserDto: LoginUserDto = { email: "test", password: "test" };
      const result = {
        id: "e7bdde2a-fae7-46b7-b04e-c9014e538b43",
        createdAt: new Date(),
        updatedAt: new Date(),
        email: "test@gmail.com",
        role: UserRole.USER,
      };
      jest.spyOn(authService, "authenticateUser").mockResolvedValue({
        ...result,
        role: UserRole.USER,
      });

      expect(await authController.login(loginUserDto)).toEqual({
        ...result,
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
      });
    });

    it("should throw an InternalServerErrorException on error", async () => {
      const loginUserDto: LoginUserDto = { email: "test", password: "test" };
      jest.spyOn(authService, "authenticateUser").mockRejectedValue(new Error("Error"));

      await expect(authController.login(loginUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("logout", () => {
    it("should logout a user", async () => {
      const req = { session: { destroy: jest.fn((cb) => cb()), sessionID: "sessionId" } } as any;
      const result = { message: "Logged out successfully" };

      expect(await authController.logout(req)).toEqual(result);
    });
  });
});
