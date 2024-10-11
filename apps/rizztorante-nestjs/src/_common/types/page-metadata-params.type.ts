import type { PageOptionsDto } from "@common/dto/pagination/page-options.dto";

export type PageMetadataParams = {
  pageOptionsDto: PageOptionsDto;
  totalItems: number;
};
