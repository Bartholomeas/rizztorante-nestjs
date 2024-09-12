import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UserRole } from "@common/types/user-roles.types";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";

import { CreateOperatingHourDto, UpdateOperatingHourDto } from "./dto/operating-hour.dto";
import { CreateSpecialDateDto, UpdateSpecialDateDto } from "./dto/special-dates.dto";
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
  @Post("operating-hours")
  async createOperatingHour(@Body(ValidationPipe) dto: CreateOperatingHourDto) {
    try {
      return this.service.createOperatingHour(dto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post("special-dates")
  async addSpecialDate(@Body(ValidationPipe) dto: CreateSpecialDateDto) {
    try {
      return this.service.createSpecialDate(dto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Put("special-dates/:id")
  async updateSpecialDate(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) dto: UpdateSpecialDateDto,
  ) {
    try {
      return this.service.updateSpecialDate(id, dto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Put("operating-hours/:id")
  async updateOperatingHour(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) dto: UpdateOperatingHourDto,
  ) {
    try {
      return this.service.updateOperatingHour(id, dto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete("operating-hours/:id")
  async deleteOperatingHour(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.service.deleteOperatingHour(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete("special-dates/:id")
  async deleteSpecialDate(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.service.deleteSpecialDate(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
