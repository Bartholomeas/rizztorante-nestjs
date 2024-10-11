import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsString } from "class-validator";

export class LoginEmployeeDto {
  @ApiProperty()
  @IsEmail({}, { message: "Email is not valid" })
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
