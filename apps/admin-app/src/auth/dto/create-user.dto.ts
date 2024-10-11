import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;

  @ApiProperty()
  @IsString()
  confirmPassword: string;
}
