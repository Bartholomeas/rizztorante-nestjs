import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Session,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "@common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "@common/dto/pagination/page-options.dto";
import { PageDto } from "@common/dto/pagination/page.dto";

import { SessionContent } from "@/auth/sessions/types/session.types";

import { CreateOpinionDto } from "./dto/create-opinion.dto";
import { OpinionDto } from "./dto/opinion.dto";
import { OpinionsService } from "./opinions.service";

@Controller("opinions")
@ApiTags("Opinions")
export class OpinionsController {
  constructor(private readonly service: OpinionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all opinions" })
  @ApiPaginatedResponse(OpinionDto)
  async getAllOpinions(
    @Session() session: SessionContent,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<OpinionDto>> {
    try {
      return await this.service.getAllOpinions(pageOptionsDto, session?.passport?.user?.role);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Put(":id/approve")
  @ApiOperation({ summary: "Approve opinion" })
  async approveOpinion(@Param("id") id: string) {
    try {
      return await this.service.approveOpinion(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
  @Post()
  @ApiOperation({ summary: "Add opinion" })
  async addOpinion(@Body(ValidationPipe) dto: CreateOpinionDto) {
    try {
      return await this.service.addOpinion(dto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
