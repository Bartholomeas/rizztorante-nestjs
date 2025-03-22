import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateOperatingHourDto, UpdateOperatingHourDto } from "./dto/operating-hour.dto";
import { CreateSpecialDateDto, UpdateSpecialDateDto } from "./dto/special-dates.dto";
import { OperatingHours } from "./entities/operating-hours.entity";
import { SpecialDate } from "./entities/special-dates.entity";

@Injectable()
export class RestaurantConfigService {
  constructor(
    @InjectRepository(OperatingHours)
    private readonly operatingHoursRepository: Repository<OperatingHours>,
    @InjectRepository(SpecialDate)
    private readonly specialDatesRepository: Repository<SpecialDate>,
  ) {}

  async getRestaurantConfig() {
    const operatingHours = await this.operatingHoursRepository.find({
      cache: {
        id: "operating-hours",
        milliseconds: 1000 * 60 * 60 * 4,
      },
      order: {
        dayOfWeek: "ASC",
      },
    });

    const specialDates = await this.specialDatesRepository.find({
      cache: {
        id: "special-dates",
        milliseconds: 1000 * 60 * 60 * 4,
      },
      order: {
        date: "ASC",
      },
    });

    return { operatingHours, specialDates };
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

  async deleteOperatingHour(id: string) {
    await this.operatingHoursRepository.delete({ id });
  }
  async updateSpecialDate(id: string, dto: UpdateSpecialDateDto) {
    const specialDate = await this.specialDatesRepository.findOneBy({ id });
    if (!specialDate) throw new NotFoundException("Special date with this ID doesnt exist!");
    Object.assign(specialDate, dto);
    return await this.specialDatesRepository.save(specialDate);
  }

  async createSpecialDate(dto: CreateSpecialDateDto) {
    const specialDate = await this.specialDatesRepository.findOne({
      where: {
        date: dto.date,
      },
    });

    if (specialDate) return await this.updateSpecialDate(specialDate.id, dto);

    const newSpecialDate = this.specialDatesRepository.create(dto);
    return await this.specialDatesRepository.save(newSpecialDate);
  }
}
