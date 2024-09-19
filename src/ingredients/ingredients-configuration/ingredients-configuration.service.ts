import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { PageMetadataDto } from "@common/dto/pagination/page-metadata.dto";
import { PageOptionsWithSearchDto } from "@common/dto/pagination/page-options-with-search.dto";
import { PageDto } from "@common/dto/pagination/page.dto";

import { getSinglePositionEvent } from "@events/payloads";

import { MenuPosition } from "@/menu/entities/menu-position.entity";

import { CreateIngredientsConfigurationDto } from "./dto/create-ingredients-configuration.dto";
import { UpdateIngredientsConfigurationDto } from "./dto/update-ingredients-configuration.dto";
import { ConfigurableIngredient } from "./entities/configurable-ingredient.entity";
import { IngredientsConfiguration } from "./entities/ingredients-configuration.entity";

@Injectable()
export class IngredientsConfigurationService {
  constructor(
    @InjectRepository(IngredientsConfiguration)
    private readonly ingredientsConfigurationRepository: Repository<IngredientsConfiguration>,
    @InjectRepository(ConfigurableIngredient)
    private readonly configurableIngredientRepository: Repository<ConfigurableIngredient>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAllConfigurations(pageOptionsDto: PageOptionsWithSearchDto): Promise<PageDto<unknown>> {
    const queryBuilder = this.ingredientsConfigurationRepository.createQueryBuilder(
      "ingredientsConfiguration",
    );

    queryBuilder
      .orderBy("ingredientsConfiguration.name", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

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

    return menuPosition;
  }

  async createConfiguration(createIngredientsConfigurationDto: CreateIngredientsConfigurationDto) {
    const ingredientsConfiguration = this.ingredientsConfigurationRepository.create(
      createIngredientsConfigurationDto,
    );
    const nameExists = await this.ingredientsConfigurationRepository.exists({
      where: {
        name: createIngredientsConfigurationDto.name,
      },
    });

    if (nameExists) throw new ConflictException("Name already exists");

    return await this.ingredientsConfigurationRepository.save(ingredientsConfiguration);
  }

  async updateConfiguration(updateIngredientsConfigurationDto: UpdateIngredientsConfigurationDto) {
    console.log(updateIngredientsConfigurationDto);
    throw new Error("Method not implemented.");
  }

  async deleteConfiguration(id: string): Promise<unknown> {
    const configuration = await this.ingredientsConfigurationRepository.findOneBy({ id });
    if (!configuration) throw new NotFoundException(`Configuration with id ${id} not found`);
    return await this.ingredientsConfigurationRepository.delete(configuration);
  }
}
