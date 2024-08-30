import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Menu } from "@/menu/entity/menu.entity";

@Injectable()
export class MenuPublicService {
  constructor(@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>) {}

  async getMenus(): Promise<Menu[]> {
    return this.menuRepository.find();
  }
}
