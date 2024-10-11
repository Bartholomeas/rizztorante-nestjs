import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
  @ApiProperty()
  @IsEmail({}, { message: "Email is not valid" })
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
