import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { PageMetadataDto } from "@common/dto/pagination/page-metadata.dto";
import { PageOptionsDto } from "@common/dto/pagination/page-options.dto";
import { PageDto } from "@common/dto/pagination/page.dto";

import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { IngredientDto } from "./dto/ingredient-dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { Ingredient } from "./entities/ingredient.entity";

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<IngredientDto>> {
    const queryBuilder = this.ingredientRepository.createQueryBuilder("ingredient");

    queryBuilder
      .orderBy("ingredient.name", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const [entities, totalItems] = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetadataDto({ pageOptionsDto, totalItems });

    return new PageDto(entities, pageMetaDto);
  }

  async create(createIngredientDto: CreateIngredientDto) {
    const ingredient = this.ingredientRepository.create(createIngredientDto);
    return await this.ingredientRepository.save(ingredient);
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.ingredientRepository.findOneBy({ id });
    if (!ingredient) throw new NotFoundException("Ingredient not found");

    return await this.ingredientRepository.save({ ...ingredient, ...updateIngredientDto });
  }

  async delete(id: string) {
    const ingredient = await this.ingredientRepository.findOneBy({ id });
    if (!ingredient) throw new NotFoundException("Ingredient not found");

    return await this.ingredientRepository.delete({ id });
  }
}
