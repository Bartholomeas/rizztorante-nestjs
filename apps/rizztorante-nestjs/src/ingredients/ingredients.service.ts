import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { PageMetadataDto } from "@common/dto/pagination/page-metadata.dto";
import { PageOptionsWithSearchDto } from "@common/dto/pagination/page-options-with-search.dto";
import { PageDto } from "@common/dto/pagination/page.dto";

import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { IngredientDto } from "./dto/ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { Ingredient } from "./entities/ingredient.entity";

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async findAllIngredients(
    pageOptionsDto: PageOptionsWithSearchDto,
  ): Promise<PageDto<IngredientDto>> {
    const queryBuilder = this.ingredientRepository.createQueryBuilder("ingredient");

    queryBuilder
      .leftJoinAndSelect("ingredient.image", "image")
      .orderBy("ingredient.name", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (pageOptionsDto.search)
      queryBuilder.where("LOWER(ingredient.name) LIKE LOWER(:search)", {
        search: `%${pageOptionsDto.search}%`,
      });

    const [entities, totalItems] = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetadataDto({ pageOptionsDto, totalItems });

    return new PageDto(entities, pageMetaDto);
  }

  async createIngredient(createIngredientDto: CreateIngredientDto) {
    const ingredient = this.ingredientRepository.create(createIngredientDto);
    return await this.ingredientRepository.save(ingredient);
  }

  async updateIngredient(id: string, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.ingredientRepository.findOneBy({ id });
    if (!ingredient) throw new NotFoundException("Ingredient not found");

    return await this.ingredientRepository.save({ ...ingredient, ...updateIngredientDto });
  }

  async deleteIngredient(id: string) {
    const ingredient = await this.ingredientRepository.findOneBy({ id });
    if (!ingredient) throw new NotFoundException("Ingredient not found");

    return await this.ingredientRepository.delete({ id });
  }
}
