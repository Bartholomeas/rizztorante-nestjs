import { Injectable } from "@nestjs/common";
import { DataSource, FindOneOptions, Repository } from "typeorm";

import { Menu } from "../entities/menu.entity";
import { MenuRepository } from "../repositories/menu.repository";

@Injectable()
export class TypeormMenuRepository extends Repository<Menu> implements MenuRepository {
  constructor(dataSource: DataSource) {
    super(Menu, dataSource.createEntityManager());
  }

  async findMenuBySlug(slug: string, options: FindOneOptions<Menu> = {}): Promise<Menu | null> {
    return await this.findOne({
      where: { slug },
      cache: {
        id: `menu-${slug}`,
        milliseconds: 1000 * 60 * 3,
      },
      ...options,
    });
  }
}
