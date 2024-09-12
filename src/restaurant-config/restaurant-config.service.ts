import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { CreateOperatingHourDto, UpdateOperatingHourDto } from "./dto/operating-hour.dto";
import { CreateSpecialDateDto, UpdateSpecialDateDto } from "./dto/special-dates.dto";
import { OperatingHours } from "./entities/operating-hours.entity";
import { RestaurantConfig } from "./entities/restaurant-config.entity";
import { SpecialDate } from "./entities/special-dates.entity";

@Injectable()
export class RestaurantConfigService {
  constructor(
    @InjectRepository(RestaurantConfig)
    private readonly restaurantConfigRepository: Repository<RestaurantConfig>,
    @InjectRepository(OperatingHours)
    private readonly operatingHoursRepository: Repository<OperatingHours>,
    @InjectRepository(SpecialDate)
    private readonly specialDatesRepository: Repository<SpecialDate>,
  ) {}

  async getRestaurantConfig() {
    return await this.restaurantConfigRepository.find({
      cache: {
        id: "restaurant-config",
        milliseconds: 1000 * 60 * 60 * 6,
      },
      relations: {
        operatingHours: true,
        specialDates: true,
      },
    });
  }

  async createOperatingHour(dto: CreateOperatingHourDto) {
    const operatingHour = await this.operatingHoursRepository.findOne({
      where: {
        dayOfWeek: dto.dayOfWeek,
      },
    });

    if (operatingHour) return await this.updateOperatingHour(operatingHour?.id, dto);

    const newOperatingHour = this.operatingHoursRepository.create(dto);
    return await this.operatingHoursRepository.save(newOperatingHour);
  }

  async updateOperatingHour(id: string, dto: UpdateOperatingHourDto) {
    const operatingHour = await this.operatingHoursRepository.findOneBy({ id });
    Object.assign(operatingHour, dto);
    return await this.operatingHoursRepository.save(operatingHour);
  }

  async deleteSpecialDate(id: string) {
    await this.specialDatesRepository.delete({ id });
  }

  async updateSpecialDate(id: string, dto: UpdateSpecialDateDto) {
    const specialDate = await this.specialDatesRepository.findOneBy({ id });
    if (!specialDate) throw new NotFoundException("Special date with this ID doesnt exist!");
    Object.assign(specialDate, dto);
    return await this.specialDatesRepository.save(specialDate);
  }

  async createSpecialDate(dto: CreateSpecialDateDto) {
    const newSpecialDate = this.specialDatesRepository.create(dto);
    console.log("FF", newSpecialDate);
    return await this.specialDatesRepository.save(newSpecialDate);
  }

  async initRestaurantConfig() {
    const config = (await this.restaurantConfigRepository.find())?.length > 0;
    if (config) throw new ConflictException("Restaurant config already exists!");

    const newConfig = this.restaurantConfigRepository.create();
    return this.restaurantConfigRepository.save(newConfig);
  }
}
