import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { PageMetadataDto } from "@common/dto/pagination/page-metadata.dto";
import { PageOptionsWithSearchDto } from "@common/dto/pagination/page-options-with-search.dto";
import { PageDto } from "@common/dto/pagination/page.dto";

import { getSinglePositionEvent } from "@events/payloads";

import { MenuPosition } from "@/menu/entities/menu-position.entity";

import { CreateConfigurableIngredientDto } from "./dto/create-configurable-ingredient.dto";
import { CreateIngredientsConfigDto } from "./dto/create-ingredients-config.dto";
import { UpdateIngredientsConfigDto } from "./dto/update-ingredients-config.dto";
import { ConfigurableIngredient } from "./entities/configurable-ingredient.entity";
import { IngredientsConfig } from "./entities/ingredients-config.entity";

@Injectable()
export class IngredientsConfigService {
  constructor(
    @InjectRepository(IngredientsConfig)
    private readonly ingredientsConfigRepository: Repository<IngredientsConfig>,
    @InjectRepository(ConfigurableIngredient)
    private readonly configurableIngredientRepository: Repository<ConfigurableIngredient>,
    // @InjectRepository(Ingredient)
    // private readonly ingredientRepository: Repository<Ingredient>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAllConfigurations(pageOptionsDto: PageOptionsWithSearchDto): Promise<PageDto<unknown>> {
    const queryBuilder = this.ingredientsConfigRepository.createQueryBuilder(
      "ingredientsConfiguration",
    );
    queryBuilder
      // .leftJoinAndSelect("ingredientsConfiguration.ingredients", "ingredients")
      .leftJoinAndSelect("ingredientsConfiguration.menuPositions", "menuPositions")
      .orderBy("ingredientsConfiguration.name", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .relation("ingredients")
      .relation("menuPositions");

    if (pageOptionsDto.search)
      queryBuilder.where("LOWER(ingredientsConfiguration.name) LIKE LOWER(:search)", {
        search: `%${pageOptionsDto.search}%`,
      });

    const [entities, totalItems] = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetadataDto({ pageOptionsDto, totalItems });

    return new PageDto(entities, pageMetaDto);
  }

  async findMenuPositionConfiguration(menuPositionId: string) {
    const [menuPosition] = (await this.eventEmitter.emitAsync(
      ...getSinglePositionEvent(menuPositionId),
    )) as [MenuPosition];

    if (!menuPosition) throw new NotFoundException("Menu position not found");

    const configuration = await this.ingredientsConfigRepository.findOne({
      where: {
        menuPositions: { id: menuPosition.id },
      },
      relations: {
        menuPositions: true,
        // ingredients: true,
      },
    });

    if (!configuration) throw new NotFoundException("Configuration not found");

    return configuration;
  }

  async findConfiguration(id: string) {
    return await this.retrieveConfiguration(id);
  }
  async createConfigurableIngredients(
    createConfigurableIngredientDto: CreateConfigurableIngredientDto,
  ) {
    console.log("createConfigurableIngredientDto:", createConfigurableIngredientDto);
    throw new Error("Method not implemented.");
  }
  async createConfiguration(createIngredientsConfigurationDto: CreateIngredientsConfigDto) {
    const nameExists = await this.ingredientsConfigRepository.exists({
      where: {
        name: createIngredientsConfigurationDto.name,
      },
    });

    if (nameExists) throw new ConflictException("Name already exists");

    const configuration = new IngredientsConfig();
    configuration.name = createIngredientsConfigurationDto.name;

    if (createIngredientsConfigurationDto.menuPositionIds.length > 0)
      configuration.menuPositions = await this.retrieveMenuPositions(
        createIngredientsConfigurationDto.menuPositionIds,
      );

    if (createIngredientsConfigurationDto.ingredientIds.length > 0)
      configuration.ingredients = await this.retrieveIngredients(
        createIngredientsConfigurationDto.ingredientIds,
      );

    return await this.ingredientsConfigRepository.save(configuration);
  }

  async updateConfiguration(
    id: string,
    updateIngredientsConfigurationDto: UpdateIngredientsConfigDto,
  ) {
    const configuration = await this.retrieveConfiguration(id);
    configuration.name = updateIngredientsConfigurationDto.name;

    if (updateIngredientsConfigurationDto.menuPositionIds.length > 0)
      configuration.menuPositions = await this.retrieveMenuPositions(
        updateIngredientsConfigurationDto.menuPositionIds,
      );

    if (updateIngredientsConfigurationDto.ingredientIds.length > 0)
      configuration.ingredients = await this.retrieveIngredients(
        updateIngredientsConfigurationDto.ingredientIds,
      );

    return await this.ingredientsConfigRepository.save(configuration);
  }

  async deleteConfiguration(id: string): Promise<unknown> {
    const configuration = await this.retrieveConfiguration(id);
    return await this.ingredientsConfigRepository.delete(configuration);
  }

  private async retrieveConfiguration(id: string): Promise<IngredientsConfig> {
    const configuration = await this.ingredientsConfigRepository.findOneBy({ id });
    if (!configuration) throw new NotFoundException(`Configuration with id ${id} not found`);
    return configuration;
  }

  private async retrieveMenuPositions(menuPositionIds: string[]) {
    return await Promise.all(
      menuPositionIds?.map((positionId) =>
        this.eventEmitter.emitAsync(...getSinglePositionEvent(positionId)),
      ),
    ).then((results) => results?.flatMap((items) => items.filter(Boolean)));
  }

  private async retrieveIngredients(ingredientIds: string[]) {
    return await Promise.all(
      ingredientIds?.map((positionId) =>
        this.eventEmitter.emitAsync(...getSinglePositionEvent(positionId)),
      ),
    ).then((results) => results?.flatMap((items) => items.filter(Boolean)));
  }
}
