import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { AuthUtils } from "./auth.utils";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "./entity/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, "password">> {
    if (createUserDto.password !== createUserDto.confirmPassword)
      throw new BadRequestException("Passwords do not match");

    const userExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userExists) throw new ConflictException("User already exists");

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
    });

    return AuthUtils.removePasswordFromResponse(await this.userRepository.save(user));
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    return user;
  }

  public async validateUser(loginUserDto: LoginUserDto): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException("We cannot find an account");
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return AuthUtils.removePasswordFromResponse(user);
  }
}
