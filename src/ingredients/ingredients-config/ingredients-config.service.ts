import { PageMetadataDto } from "@common/dto/pagination/page-metadata.dto";
import { PageOptionsWithSearchDto } from "@common/dto/pagination/page-options-with-search.dto";
import { PageDto } from "@common/dto/pagination/page.dto";
import { getSinglePositionEvent } from "@events/payloads";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { MenuPosition } from "@/menu/entities/menu-position.entity";

import { Ingredient } from "../entities/ingredient.entity";

import { ConfigurableIngredientDto } from "./dto/configurable-ingredient.dto";
import { ConfigurationWithIdsDto } from "./dto/configuration-with-ids.dto";
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
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAllConfigurations(
    pageOptionsDto: PageOptionsWithSearchDto,
  ): Promise<PageDto<ConfigurationWithIdsDto>> {
    const queryBuilder = this.ingredientsConfigRepository.createQueryBuilder(
      "ingredientsConfiguration",
    );

    queryBuilder
      .leftJoin("ingredientsConfiguration.configurableIngredients", "configurableIngredients")
      .leftJoin("ingredientsConfiguration.menuPositions", "menuPositions")
      .addSelect(["configurableIngredients.id", "menuPositions.id"])
      .orderBy("ingredientsConfiguration.name", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .relation("ingredients")
      .relation("menuPositions");

    if (pageOptionsDto.search) {
      queryBuilder.where("LOWER(ingredientsConfiguration.name) LIKE LOWER(:search)", {
        search: `%${pageOptionsDto.search}%`,
      });
    }

    const [entities, totalItems] = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetadataDto({ pageOptionsDto, totalItems });

    return new PageDto(entities, pageMetaDto);
  }

  async findConfiguration(id: string) {
    return await this.retrieveConfiguration(id);
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
      },
    });

    if (!configuration) throw new NotFoundException("Configuration not found");

    return configuration;
  }

  async findAllConfigurableIngredients(
    pageOptionsDto: PageOptionsWithSearchDto,
  ): Promise<PageDto<ConfigurableIngredientDto>> {
    const queryBuilder =
      this.configurableIngredientRepository.createQueryBuilder("configurableIngredient");

    queryBuilder
      .orderBy("ingredient.name")
      .leftJoinAndSelect("configurableIngredient.ingredient", "ingredient")
      .take(pageOptionsDto.take)
      .skip(pageOptionsDto.skip)
      .relation("ingredient");

    if (pageOptionsDto.search) {
      queryBuilder.where("LOWER(ingredient.name) LIKE LOWER(:search)", {
        search: `%${pageOptionsDto.search}%`,
      });
    }

    const [entities, totalItems] = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetadataDto({ pageOptionsDto, totalItems });

    return new PageDto(entities, pageMetaDto);
  }

  async findConfigurableIngredients(
    configurableIngredientId: string[],
  ): Promise<ConfigurableIngredient[]> {
    return await this.configurableIngredientRepository.find({
      where: {
        id: In(configurableIngredientId),
      },
      relations: { ingredient: true },
    });
  }

  async createConfigurableIngredient(
    ingredientId: string,
    { priceAdjustment, maxQuantity }: CreateConfigurableIngredientDto,
  ) {
    const ingredient = await this.ingredientRepository.findOneBy({ id: ingredientId });
    if (!ingredient) throw new NotFoundException("Ingredient not found");

    const configurableIngredient = this.configurableIngredientRepository.create({
      priceAdjustment,
      maxQuantity,
      ingredient,
    });

    return await this.configurableIngredientRepository.save(configurableIngredient);
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

    if (createIngredientsConfigurationDto.configurableIngredientIds.length > 0)
      configuration.configurableIngredients = await this.retrieveIngredients(
        createIngredientsConfigurationDto.configurableIngredientIds,
      );

    return await this.ingredientsConfigRepository.save(configuration);
  }

  async addConfigurableIngredientToConfig(configId: string, configurableIngredientId: string) {
    const config = await this.retrieveConfiguration(configId);
    const configurableIngredient = await this.configurableIngredientRepository.findOne({
      where: { id: configurableIngredientId },
    });

    if (!configurableIngredient) throw new NotFoundException("Configurable ingredient not found");
    if (!config.configurableIngredients) config.configurableIngredients = [];

    const existingIngredient = config.configurableIngredients?.find(
      (ing) => ing.id === configurableIngredient.id,
    );

    if (!existingIngredient)
      config.configurableIngredients = [...config.configurableIngredients, configurableIngredient];

    return await this.ingredientsConfigRepository.save(config).catch((err) => {
      console.log("kurła", err);
    });
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

    if (updateIngredientsConfigurationDto.configurableIngredientIds.length > 0)
      configuration.configurableIngredients = await this.retrieveIngredients(
        updateIngredientsConfigurationDto.configurableIngredientIds,
      );

    return await this.ingredientsConfigRepository.save(configuration);
  }

  async removeConfigurableIngredientFromConfig(configId: string, ingredientId: string) {
    const config = await this.retrieveConfiguration(configId);
    config.configurableIngredients = config.configurableIngredients.filter(
      (ingredient) => ingredient.id !== ingredientId,
    );
    return await this.ingredientsConfigRepository.save(config);
  }

  async deleteConfiguration(id: string): Promise<unknown> {
    const configuration = await this.retrieveConfiguration(id);
    return await this.ingredientsConfigRepository.delete(configuration);
  }

  private async retrieveConfiguration(id: string): Promise<IngredientsConfig> {
    const configuration = await this.ingredientsConfigRepository.findOne({
      where: { id },
      relations: {
        configurableIngredients: true,
        menuPositions: true,
      },
    });
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
