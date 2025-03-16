import type { JwtPayloadDto } from "@common/dto/jwt-payload.dto";

export interface AuthJwtUserDto {
  accessToken: string;
  user: JwtPayloadDto;
}
