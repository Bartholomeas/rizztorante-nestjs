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

import { UserEventTypes } from "@events/events";
import { GuestCreatedPayload } from "@events/payloads";

import { UserRole } from "@/_common/types/user-roles.type";
import { SessionEntity } from "@/auth/sessions/entity/session.entity";
import { User } from "@/users/entities/user.entity";

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
    const user: User = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (!user) throw new BadRequestException("User not found");

    const passwordsMatch: boolean = bcrypt.compareSync(dto.password, user.password);
    if (!passwordsMatch) throw new BadRequestException("Passwords does not match");

    return user;
  }

  //  - - - -

  // async registerUser(createUserDto: CreateUserDto): Promise<Omit<User, "password">> {
  //   if (createUserDto.password !== createUserDto.confirmPassword)
  //     throw new BadRequestException("Passwords do not match");

  //   const existingUser = await this.findUserByEmail(createUserDto.email);

  //   if (existingUser) throw new ConflictException("User with this email already exists");

  //   const hashedPassword = await this.hashPassword(createUserDto.password);
  //   const newUser = this.userRepository.create({
  //     email: createUserDto.email,
  //     password: hashedPassword,
  //   });

  //   const savedUser = await this.userRepository.save(newUser);
  //   return RemovePasswordUtils.removePasswordFromResponse(savedUser);
  // }

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

  async login2(dto: LoginUserDto): Promise<{ accessToken: string }> {
    this.logger.log("Authnticating user: ", dto.email);
    const payload = { email: dto.email, id: "123" }; // TODO: fill this id property

    return { accessToken: this.jwtService.sign(payload) };

    // const accessToken = this.jwtService.sign({ ...dto });

    // const user = await this.findUserByEmail(dto.email);

    // this.logger.debug("found user: ", { user, accessToken });
    // if (!user) throw new NotFoundException("User not found");

    // await this.verifyPassword(dto.password, user.password);

    // return RemovePasswordUtils.removePasswordFromResponse(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<Omit<User, "password">> {
    this.logger.log("Authnticating user: ", loginUserDto.email);

    const user = await this.findUserByEmail(loginUserDto.email);
    this.logger.debug("found user: ", { user });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.verifyPassword(loginUserDto.password, user.password);

    return RemovePasswordUtils.removePasswordFromResponse(user);
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
