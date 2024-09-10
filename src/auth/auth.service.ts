import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { UserEventTypes } from "@events/events";
import { GuestCreatedPayload } from "@events/payloads";

import { UserRole } from "@/_common/types/user-roles.types";
import { User } from "@/auth/entities/user.entity";
import { SessionEntity } from "@/auth/sessions/entity/session.entity";

import { AuthUtils } from "./auth.utils";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  async getUserProfile(userId: string | undefined): Promise<Omit<User, "password">> {
    if (!userId) throw new NotFoundException("User ID is required");

    const user = await this.findUserById(userId);
    if (!user) throw new NotFoundException("User not found");
    return AuthUtils.removePasswordFromResponse(user);
  }

  async registerUser(createUserDto: CreateUserDto): Promise<Omit<User, "password">> {
    if (createUserDto.password !== createUserDto.confirmPassword)
      throw new BadRequestException("Passwords do not match");

    const existingUser = await this.findUserByEmail(createUserDto.email);

    if (existingUser) throw new ConflictException("User with this email already exists");

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const newUser = this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    return AuthUtils.removePasswordFromResponse(savedUser);
  }

  async authenticateUser(loginUserDto: LoginUserDto): Promise<Omit<User, "password">> {
    const user = await this.findUserByEmail(loginUserDto.email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.verifyPassword(loginUserDto.password, user.password);

    return AuthUtils.removePasswordFromResponse(user);
  }

  @OnEvent(UserEventTypes.GUEST_CREATED)
  async createOrRetrieveGuestUser({ userId, sessionId }: GuestCreatedPayload = {}): Promise<User> {
    if (userId) {
      const session = await this.getActiveSession(sessionId);
      if (session) {
        const existingUser = await this.findUserById(userId);
        if (existingUser) return existingUser;
      }
    }
    return this.createNewGuestUser();
  }

  private async findUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    const isPasswordValid = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  private async getActiveSession(sessionId: string): Promise<SessionEntity | null> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (session && !session.deletedAt && session.expiredAt > Date.now()) {
      return session;
    }

    return null;
  }

  private async createNewGuestUser(): Promise<User> {
    const guestUser = this.userRepository.create({
      email: null,
      password: null,
      role: UserRole.GUEST,
    });
    return this.userRepository.save(guestUser);
  }
}
