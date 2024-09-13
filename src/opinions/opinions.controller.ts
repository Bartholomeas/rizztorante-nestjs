import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
  Session,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SessionContent } from "@/auth/sessions/types/session.types";

import { CreateOpinionDto } from "./dto/create-opinion.dto";
import { OpinionsService } from "./opinions.service";

@Controller("opinions")
@ApiTags("Opinions")
export class OpinionsController {
  constructor(private readonly service: OpinionsService) {}

  @Get()
  @ApiOperation({ summary: "Get all opinions" })
  async getAllOpinions(@Session() session: SessionContent) {
    try {
      return await this.service.getAllOpinions(session?.passport?.user?.role);
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
