import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";

import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { JwtUserDto } from "@common/types/jwt.types";
import { UserRole } from "@common/types/user-roles.type";

import { UserEventTypes } from "@events/events";

import { SessionEntity } from "@/auth/sessions/entity/session.entity";
import { User } from "@/users/entities/user.entity";

import { AuthJwtUserDto } from "./dto/auth-jwt-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ValidateUserDto } from "./dto/validate-user.dto";
import { RemovePasswordUtils } from "../_common/utils/remove-password.utils";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(dto: ValidateUserDto): Promise<User> {
    const user = await this.findUserByEmail(dto.email);

    if (!user) throw new BadRequestException("User not found");

    const passwordsMatch: boolean = bcrypt.compareSync(dto.password, user.password);
    if (!passwordsMatch) throw new BadRequestException("Passwords does not match");

    return user;
  }

  async registerUser(dto: CreateUserDto) {
    const user: User = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (user) throw new ConflictException("User with this email already exists");

    const hashedPassword = await this.hashPassword(dto.password);
    const newUser = new User();
    newUser.email = dto.email;
    newUser.password = hashedPassword;

    const savedUser = await this.userRepository.save(newUser);

    return RemovePasswordUtils.removePasswordFromResponse(savedUser);
  }

  async login(dto: LoginUserDto): Promise<AuthJwtUserDto> {
    const user = await this.findUserByEmail(dto.email);

    const payload: JwtUserDto = {
      id: user.id,
      email: dto.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: RemovePasswordUtils.removePasswordFromResponse(user),
    };
  }

  async loginOld(loginUserDto: LoginUserDto): Promise<Omit<User, "password">> {
    this.logger.log("Authnticating user: ", loginUserDto.email);

    const user = await this.findUserByEmail(loginUserDto.email);

    await this.verifyPassword(loginUserDto.password, user.password);

    return RemovePasswordUtils.removePasswordFromResponse(user);
  }

  @OnEvent(UserEventTypes.GUEST_CREATED)
  async createOrRetrieveGuestUser(): Promise<AuthJwtUserDto> {
    const guestUser = await this.createNewGuestUser();

    const payload: JwtUserDto = {
      id: guestUser.id,
      email: null,
      role: UserRole.GUEST,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: RemovePasswordUtils.removePasswordFromResponse(guestUser),
    };
  }

  private async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException("User not found");
    return user;
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
