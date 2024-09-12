import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotImplementedException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UserRole } from "@common/types/user-roles.types";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";

import { RestaurantConfigService } from "./restaurant-config.service";

@Controller("restaurant-config")
@ApiTags("Restaurant Config")
export class RestaurantConfigController {
  constructor(private readonly service: RestaurantConfigService) {}

  @Get()
  async getRestaurantConfig() {
    try {
      return this.service.getRestaurantConfig();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async initRestaurantConfig() {
    try {
      return this.service.initRestaurantConfig();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post("operating-hours")
  async createOperatingHour() {
    throw new NotImplementedException();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Put("operating-hours/:id")
  async updateOperatingHour(@Param("id", new ParseUUIDPipe()) id: string) {
    throw new NotImplementedException(id);
  }
}
