import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Menu } from "@/menu/entities/menu.entity";

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async getAll(): Promise<Menu[]> {
    return this.menuRepository.find();
  }

  async create(): Promise<Menu> {
    const menu = this.menuRepository.create({
      name: "Menu test",
      options: ["testowe", "costam"],
    });

    return this.menuRepository.save(menu);
  }
}
