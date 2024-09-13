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
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "@common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "@common/dto/pagination/page-options.dto";
import { PageDto } from "@common/dto/pagination/page.dto";
import { UserRole } from "@common/types/user-roles.type";

import { Roles } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { SessionContent } from "@/auth/sessions/types/session.types";

import { ApproveOpinionDto } from "./dto/approve-opinion.dto";
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

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Put(":id/approve")
  @ApiOperation({ summary: "Approve opinion" })
  async approveOpinion(@Param("id") id: string, @Body() approveOpinionDto: ApproveOpinionDto) {
    try {
      return await this.service.approveOpinion(id, approveOpinionDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
